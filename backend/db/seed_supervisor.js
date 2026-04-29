// seedSupervisor.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path if needed
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Pothole_Detection";

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

async function seedSupervisor() {
  try {
    const supervisor = {
      name: "Super Admin",
      email: "supervisor@example.com",
      // password: await bcrypt.hash('Supervisor123', 10),
      password: 'Supervisor123',
      role: "supervisor",
      address: "Mumbai, Maharashtra, India",
      mobileNo: "9000000011"
    };

    const inserted = await User.create(supervisor);
    console.log('Inserted supervisor:', inserted);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedSupervisor();
