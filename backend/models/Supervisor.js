// models/Supervisor.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const supervisorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, match: [/\S+@\S+\.\S+/, "Email invalid"] },
    password: { type: String, required: true, minlength: 8 },
    phoneNumber: { type: String, match: [/^\+?\d{7,15}$/, "Phone number invalid"] },
  },
  { timestamps: true }
);

// Password encryption
supervisorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

supervisorSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Supervisor = mongoose.model('Supervisor', supervisorSchema);
module.exports = Supervisor;
