const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// -------------------- REGISTER --------------------
// Only for normal users
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, address, mobileNo } = req.body;

    if (!name || !email || !password || !address || !mobileNo) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // force role = user
    const role = 'user';

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashed, address, mobileNo, role });
    await user.save();

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        mobileNo: user.mobileNo,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// -------------------- LOGIN --------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    // find user by email only
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // For Field Officer / Supervisor, ensure they are pre-approved
    if (user.role === 'field-officer' || user.role === 'supervisor') {
      // no extra check needed if DB has only hardcoded emails
      // you can optionally log attempt if needed
    }
    console.log(password)
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        mobileNo: user.mobileNo,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
