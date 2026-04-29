const mongoose = require('mongoose');
const Report = require('../models/Reports'); // adjust path
const User = require('../models/User');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Pothole_Detection";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const fieldOfficers = [
  { name: "Ravi Shinde", lat: 19.288073, lng: 73.059898, address: "Kaneri, Bhiwandi, Thane, Maharashtra, India" },
  { name: "Sneha Patil", lat: 19.2183, lng: 73.0932, address: "Dombivli East, Thane, Maharashtra, India" },
  { name: "Ajay More", lat: 18.5204, lng: 73.8567, address: "Pune Camp, Pune, Maharashtra, India" },
  { name: "Priya Joshi", lat: 18.5661, lng: 73.9124, address: "Viman Nagar, Pune, Maharashtra, India" },
  { name: "Vijay Pawar", lat: 19.1191, lng: 72.8462, address: "Andheri West, Mumbai, Maharashtra, India" },
  { name: "Neha Kulkarni", lat: 19.2296, lng: 72.8562, address: "Borivali, Mumbai, Maharashtra, India" },
  { name: "Sanjay Deshmukh", lat: 21.1458, lng: 79.0882, address: "Nagpur Central, Nagpur, Maharashtra, India" },
  { name: "Pooja Gawade", lat: 20.0125, lng: 73.7902, address: "Nashik Road, Nashik, Maharashtra, India" },
  { name: "Rohan Khatri", lat: 16.7050, lng: 74.2433, address: "Kolhapur, Maharashtra, India" },
  { name: "Anita Jadhav", lat: 19.8762, lng: 75.3433, address: "Aurangabad, Maharashtra, India" },
];

const users = [
  "68daa6bc1b84d34fe8234ba1",
  "68daa6bc1b84d34fe8234ba2",
  "68daa6bc1b84d34fe8234ba3",
  "68daa6bc1b84d34fe8234ba4",
  "68daa6bc1b84d34fe8234ba5"
];

function randomNear(value, delta = 0.005) {
  return value + (Math.random() - 0.5) * delta;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedReports() {
  try {
    let reports = [];
    for (let i = 1; i <= 50; i++) {
      const officer = fieldOfficers[Math.floor(Math.random() * fieldOfficers.length)];
      const reporter = users[Math.floor(Math.random() * users.length)];
      reports.push({
        reporter,
        description: `Pothole detected near ${officer.address}`,
        severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        imageUrl: "/uploads/boxed_1759150651012.png",
        location: {
          lat: randomNear(officer.lat),
          lng: randomNear(officer.lng),
          address: officer.address
        },
        status: "pending",
        date: randomDate(new Date(2025, 0, 1), new Date()),
        reportId: `RPT-${String(i).padStart(4, "0")}`,
      });
    }

    const inserted = await Report.insertMany(reports);
    console.log("Inserted reports:", inserted.length);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedReports();
