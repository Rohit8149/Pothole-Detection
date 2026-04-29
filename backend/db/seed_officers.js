// seedUsers.js
// require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // adjust path if needed

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Pothole_Detection";
// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const now = new Date();

async function seedUsers() {
  try {
    // Clear existing users if needed
    // await User.deleteMany({});

    const users = [
      // Supervisor
      {
        name: "Super Admin",
        email: "supervisor@example.com",
        password: await bcrypt.hash('Supervisor123', 10),
        role: "supervisor",
        address: "Mumbai, Maharashtra, India",
        mobileNo: "9000000011",
        // createdAt: now,
        // updatedAt: now
      },
      // 10 Field Officers
      {
        name: "Ravi Shinde",
        email: "ravi.shinde@example.com",
        password: await bcrypt.hash('Password123', 10),
        role: "field-officer",
        address: "Kaneri, Bhiwandi, Thane, Maharashtra, India",
        mobileNo: "9000000001",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "Sneha Patil",
        email: "sneha.patil@example.com",
        password: await bcrypt.hash('Password123', 10),
        role: "field-officer",
        address: "Dombivli East, Thane, Maharashtra, India",
        mobileNo: "9000000002",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "Ajay More",
        email: "ajay.more@example.com",
        password: await bcrypt.hash('Password123', 10),
        role: "field-officer",
        address: "Pune Camp, Pune, Maharashtra, India",
        mobileNo: "9000000003",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "Priya Joshi",
        email: "priya.joshi@example.com",
        password: await bcrypt.hash('Password123', 10),
        role: "field-officer",
        address: "Viman Nagar, Pune, Maharashtra, India",
        mobileNo: "9000000004",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "Vijay Pawar",
        email: "vijay.pawar@example.com",
        password: await bcrypt.hash('Password123', 10),
        role: "field-officer",
        address: "Andheri West, Mumbai, Maharashtra, India",
        mobileNo: "9000000005",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "Neha Kulkarni",
        email: "neha.kulkarni@example.com",
        password: await bcrypt.hash('Password123', 10),
        role: "field-officer",
        address: "Borivali, Mumbai, Maharashtra, India",
        mobileNo: "9000000006",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "Sanjay Deshmukh",
        email: "sanjay.deshmukh@example.com",
        password: await bcrypt.hash('Password123', 10),
        role: "field-officer",
        address: "Nagpur Central, Nagpur, Maharashtra, India",
        mobileNo: "9000000007",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "Pooja Gawade",
        email: "pooja.gawade@example.com",
        password: await bcrypt.hash('Password123', 10),
        role: "field-officer",
        address: "Nashik Road, Nashik, Maharashtra, India",
        mobileNo: "9000000008",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "Rohan Khatri",
        email: "rohan.khatri@example.com",
        password: await bcrypt.hash('Password123', 10),
        role: "field-officer",
        address: "Kolhapur, Maharashtra, India",
        mobileNo: "9000000009",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "Anita Jadhav",
        email: "anita.jadhav@example.com",
        password: await bcrypt.hash('Password123', 10),
        role: "field-officer",
        address: "Aurangabad, Maharashtra, India",
        mobileNo: "9000000010",
        // createdAt: now,
        // updatedAt: now
      },
      // 5 regular users
      {
        name: "User One",
        email: "user1@example.com",
        password: await bcrypt.hash('User1234', 10),
        role: "user",
        address: "Thane, Maharashtra, India",
        mobileNo: "9000000021",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "User Two",
        email: "user2@example.com",
        password: await bcrypt.hash('User1234', 10),
        role: "user",
        address: "Pune, Maharashtra, India",
        mobileNo: "9000000022",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "User Three",
        email: "user3@example.com",
        password: await bcrypt.hash('User1234', 10),
        role: "user",
        address: "Mumbai, Maharashtra, India",
        mobileNo: "9000000023",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "User Four",
        email: "user4@example.com",
        password: await bcrypt.hash('User1234', 10),
        role: "user",
        address: "Nagpur, Maharashtra, India",
        mobileNo: "9000000024",
        // createdAt: now,
        // updatedAt: now
      },
      {
        name: "User Five",
        email: "user5@example.com",
        password: await bcrypt.hash('User1234', 10),
        role: "user",
        address: "Nashik, Maharashtra, India",
        mobileNo: "9000000025",
        // createdAt: now,
        // updatedAt: now
      }
    ];

    const inserted = await User.insertMany(users);
    console.log('Inserted users:', inserted.length);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedUsers();
