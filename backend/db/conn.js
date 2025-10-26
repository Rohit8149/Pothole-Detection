const mongoose = require('mongoose');
const userdata = require('../data/userdata.js')
const User = require('../models/user.js')
const potholedata = require('../data/potholes_dummy.js')
const Pothole = require('../models/pothole.js');
const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
        // await Pothole.insertMany(potholedata);
        // console.log("Pothole data inserted");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

module.exports = connection;
