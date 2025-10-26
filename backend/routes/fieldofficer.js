// FILE: routes/fieldOfficer.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Assignment = require("../models/Assignment");

// ✅ Get officer’s own assignments
router.get("/reports", auth, async (req, res) => {
  try {
    if (req.user.role !== "field-officer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const reports = await Assignment.find({ officer: req.user._id })
      .populate("report", "reportId imageUrl description severity location status date")
      .populate("officer", "name email address mobileNo"); // added address + mobileNo

    res.json({ reports });
    console.log(reports)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update report status
router.put("/reports/:id/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "field-officer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { status } = req.body;
    const allowedStatuses = ["assigned", "in-progress", "completed"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const assignment = await Assignment.findOne({
      _id: req.params.id,
      officer: req.user._id,
    }).populate("report");

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Update assignment status
    assignment.status = status;
    await assignment.save();

    // Update report status
    assignment.report.status = status;
    await assignment.report.save();

    // Populate officer details before sending response
    await assignment.populate("officer", "name email address mobileNo");

    res.json({ message: "Status updated", assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
