// models/Assignment.js
const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  officer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['assigned', 'in-progress', 'completed'], 
    default: 'assigned' 
  },
  assignedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
