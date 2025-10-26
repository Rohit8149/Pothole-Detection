// models/Reports.js
const mongoose = require('mongoose');
const Counter = require('./Counter');

const ReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportId: { 
    type: String, 
    unique: true, 
  },
  description: { type: String },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    required: true 
  },
  imageUrl: { type: String, required: true },
  location: {
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number },
  },
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'completed','in-progress','assigned'], 
    default: 'pending' 
  },
   date: { type: Date, default: Date.now }
}, { timestamps: true });

// Pre-save hook to generate sequential reportId
ReportSchema.pre('save', async function(next) {
  if (this.reportId) return next(); // already has an ID

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'report' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.reportId = `RPT-${counter.seq.toString().padStart(4, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Report', ReportSchema);
