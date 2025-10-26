// routes/dwRoutes.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'pothole_detection',
});

// ---- Road aggregates ----
router.get('/api/road-agg', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM road_agg ORDER BY total_potholes DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ---- Road predictions ----
router.get('/api/road-pred', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM road_pred_summary ORDER BY long_repairs DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ---- Officer stats ----
router.get('/api/officer-stats', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vw_officer_performance ORDER BY total_reports DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ---- Anomalies ----
router.get('/api/anomalies', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM repair_anomalies ORDER BY repairtime DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
