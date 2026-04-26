require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const assignmentRoutes = require('./routes/assignments');
const supervisorRoutes = require("./routes/supervisor");
const fieldOfficerRoutes = require("./routes/fieldofficer");
const dwRoutes = require('./routes/dwRoutes');





const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

const dashboardRoutes = require("./routes/dashboard");

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(helmet());
// app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
// serve uploads folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Cross-Origin-Resource-Policy", "cross-origin"); // important for <img>
  next();
}, express.static(path.join(__dirname, "uploads")));

app.use('/api/assignments', assignmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/getdata/dashboard", dashboardRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/field-officer", fieldOfficerRoutes);
app.use('/dwm', dwRoutes);


const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
console.log('MongoDB connected');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
console.error('DB connection error', err);
});