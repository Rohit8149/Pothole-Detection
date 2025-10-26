const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Assignment = require("../models/Assignment");

// GET /api/supervisor/reports
router.get("/reports", auth, async (req, res) => {
  try {
    if (req.user.role !== "supervisor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Populate report and officer details
    const assignments = await Assignment.find()
      .populate({
        path: "report",
        select: "reportId description severity location status date",
        options: { sort: { date: -1 } }
      })
      .populate({
        path: "officer",
        select: "name email address mobileNo",
      });

    // Transform data to match frontend structure
    const reports = assignments.map(a => ({
      _id: a.report._id,
      reportId: a.report.reportId,
      description: a.report.description,
      severity: a.report.severity,
      location: a.report.location,
      status: a.report.status,
      date: a.report.date,
      assignedTo: a.officer ? {
        _id: a.officer._id,
        name: a.officer.name,
        email: a.officer.email,
        address: a.officer.address,
        mobileNo: a.officer.mobileNo
      } : null
    }));
    console.log(reports)
    res.json({ reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
