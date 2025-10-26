// routes/assignments.js
const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('report', 'reportId description severity location')
      .populate('officer', 'name email address mobileNo');
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
