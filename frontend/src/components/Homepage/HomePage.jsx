import React from 'react';
import Navbar from '../navbar/Navbar.jsx';
import LandingSection from '../landingsection/LandingSection.jsx';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar/>
      <LandingSection/>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h2>1,247</h2>
            <p>Potholes Detected</p>
          </div>
          <div className="stat-item">
            <h2>892</h2>
            <p>Repairs Completed</p>
          </div>
          <div className="stat-item">
            <h2>98%</h2>
            <p>Accuracy Rate</p>
          </div>
          <div className="stat-item">
            <h2>24/7</h2>
            <p>Monitoring</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo">
              <img src="/pothole-logo.svg" alt="PotholeDetect Logo" />
              <span>PotholeDetect</span>
            </div>
            <p>Making roads safer with smart technology.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/report">Report Pothole</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>📧 info@potholedetect.com</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>📍 123 Tech Street, City</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 PotholeDetect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
