// controllers/authController.js
const User = require('../models/User');
const Officer = require('../models/Officer');
const Supervisor = require('../models/Supervisor');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { sendOTPEmail } = require('../services/emailService');

const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes
const JWT_SECRET = process.env.JWT_SECRET;




// ---------------- REGISTER ----------------
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password)
            return res.status(400).json({ message: 'All fields are required' });

        if (!validator.isEmail(email))
            return res.status(400).json({ message: 'Invalid email' });

        if (!validator.isLength(name, { min: 2, max: 50 }))
            return res.status(400).json({ message: 'Name must be 2-50 chars' });

        // inside register controller
        if (!validator.isStrongPassword(password, {
            minLength: 8,     // at least 8 characters
            minLowercase: 1,  // at least 1 lowercase
            minUppercase: 1,  // at least 1 uppercase
            minNumbers: 1,    // at least 1 number
            minSymbols: 1     // at least 1 special character
        })) {
            return res.status(400).json({
                message: 'Password must be at least 8 chars long and include uppercase, lowercase, number, and symbol'
            });
        }

        // Check if email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

        if (!validator.isEmail(email))
            return res.status(400).json({ message: 'Invalid email' });

        let user = await User.findOne({ email });
        let role = 'citizen';

        if (!user) {
            user = await Officer.findOne({ email });
            if (user) role = 'field-officer';
        }

        if (!user) {
            user = await Supervisor.findOne({ email });
            if (user) role = 'supervisor';
        }

        if (!user) return res.status(400).json({ message: 'Invalid Email' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Password' });

        const token = jwt.sign({ id: user._id, role: role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, role: role, name: user.name });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email))
      return res.status(400).json({ message: 'Valid email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set OTP and expiry in user document
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + OTP_EXPIRY);
    await user.save();

    // Send OTP using helper
    await sendOTPEmail(email, otp);

    res.json({ 
      message: 'OTP sent to email', 
      otpExpiry: user.otpExpiry // send expiry to frontend for countdown
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- VERIFY OTP ----------------
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry) 
      return res.status(400).json({ message: 'No OTP found' });

    // Check expiry
    if (new Date() > user.otpExpiry) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Check OTP
    if (parseInt(otp) !== user.otp) return res.status(400).json({ message: 'Invalid OTP' });

    res.json({ 
      message: 'OTP verified', 
      otpExpiry: user.otpExpiry // send expiry to frontend
    });

    // Optionally clear OTP after verification
    // user.otp = null;
    // user.otpExpiry = null;
    // await user.save();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- RESET PASSWORD ----------------
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check inputs
    if (!email || !newPassword)
      return res.status(400).json({ message: 'Email and new password required' });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: 'Invalid email' });

    // Strong password check
    if (!validator.isStrongPassword(newPassword, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      return res.status(400).json({
        message: 'Password must be at least 8 chars and include uppercase, lowercase, number, and symbol'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Update password (pre-save encrypts it)
    user.password = newPassword;

    // Optionally clear OTP fields
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
