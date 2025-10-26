// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  address: { type: String, required: true },        // new
  mobileNo: { type: String, required: true },       // new
  role: { 
    type: String, 
    enum: ['user', 'field-officer', 'supervisor'], 
    required: true,
    default: 'user'
  },
}, { timestamps: true });

// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// Compare password
UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
