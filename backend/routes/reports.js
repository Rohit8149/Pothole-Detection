// FILE: routes/reports.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const FormData = require('form-data');
const router = express.Router();
const User = require('../models/User')
const Report = require('../models/Reports');
const auth = require('../middleware/auth');
const { Console } = require('console');
const { getLatLng } = require('../utils/geocode');
const { getDistance } = require('../utils/geo'); // ✅ Add this
const Assignment = require('../models/Assignment')

// make sure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: 'Latitude and longitude are required' });

    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
      },
      headers: {
        'User-Agent': 'PotholeReporter/1.0', // Nominatim requires a user-agent
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Reverse geocode failed' });
  }
});

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// POST /api/reports - create a report (auth required)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    // Send image to model
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    const modelResponse = await axios.post('http://localhost:8000/predict', formData, {
      headers: formData.getHeaders(),
    });

    const predictions = modelResponse.data.predictions || [];
    const hasPothole = predictions.some(p => p.label === 'pothole');

    if (!hasPothole) {
      fs.unlink(req.file.path, () => { }); // delete file
      return res.status(400).json({ message: 'No pothole detected in the image' });
    }

    // Draw bounding boxes on image
    const img = await loadImage(req.file.path);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    predictions.forEach(p => {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.strokeRect(p.xmin, p.ymin, p.xmax - p.xmin, p.ymax - p.ymin);

      ctx.fillStyle = 'yellow';
      ctx.font = '18px Arial';
      ctx.fillText(`${p.label} ${(p.confidence * 100).toFixed(1)}%`, p.xmin, p.ymin - 5);
    });

    // Save annotated image as PNG
    const boxedFilename = `boxed_${Date.now()}.png`;
    const boxedFilePath = path.join('uploads', boxedFilename);
    const out = fs.createWriteStream(boxedFilePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    // Wait until image is fully written
    out.on('finish', async () => {
      try {
        const { address, lat, lng, severity, description } = req.body;

        const report = new Report({
          reporter: req.user._id,
          description,
          severity,
          imageUrl: `/uploads/${boxedFilename}`, // relative URL
          location: {
            address,
            lat: lat ? parseFloat(lat) : undefined,
            lng: lng ? parseFloat(lng) : undefined,
          },
        });

        await report.save();
        const officers = await User.find({ role: 'field-officer' }, 'address _id');
        const officerLocations = [];

        for (let officer of officers) {
          const loc = await getLatLng(officer.address);
          if (loc) officerLocations.push({ id: officer._id, ...loc });
        }

        // Find nearest officer
        let nearestOfficer = null;
        let minDistance = Infinity;

        for (let officer of officerLocations) {
          const distance = getDistance(report.location.lat, report.location.lng, officer.lat, officer.lng);
          if (distance < minDistance) {
            minDistance = distance;
            nearestOfficer = officer;
          }
        }

        // Assign report to nearest officer
        if (nearestOfficer) {
          const assignment = new Assignment({
            report: report._id,
            officer: nearestOfficer.id
          });
          await assignment.save();
          console.log(`Assigned report ${report.reportId} to officer ${nearestOfficer.id}`);
        }

        // Send full URL for frontend
        const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${boxedFilename}`;

        res.status(201).json({
          message: 'Report submitted successfully',
          report,
          boxedImageUrl: fullUrl, // frontend can use this directly
          predictions,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving report' });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/reports - list reports (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      Report.find()
        .populate('reporter', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Report.countDocuments(),
    ]);

    res.json({ data: reports, page, limit, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reports/:id - get single report
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('reporter', 'name email');
    if (!report) return res.status(404).json({ message: 'Not found' });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/reports/:id - only owner or admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Not found' });

    if (report.reporter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // delete the image file
    const filePath = path.join(__dirname, '..', report.imageUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.warn('file unlink error', err);
    });

    await report.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ this must be the last line:
module.exports = router;
