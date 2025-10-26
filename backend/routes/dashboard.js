const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Report = require("../models/Reports");

// Get dashboard data for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user info (optional, for name or profile)
    const user = await User.findById(userId).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all reports for this user
    const reports = await Report.find({ reporter: userId }).sort({ date: -1 });

    // Calculate stats
    const totalReports = reports.length;
    // const pendingReports = reports.filter(r => r.status === "pending").length;
    const pendingReports = reports.filter(r =>
      ["pending", "assigned", "verified"].includes(r.status)
    ).length;

    const verifiedReports = reports.filter(r => r.status === "in-progress").length;
    const completedReports = reports.filter(r => r.status === "completed").length;

    res.json({
      stats: {
        totalReports,
        pendingReports,
        verifiedReports,
        completedReports,
      },
      reports,
    });

  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
