import React from 'react';
import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import './About.css';
import Navbar from '../navbar/Navbar.jsx';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />

      {/* About Hero Section */}
      <section className="about-hero">
        <div className="about-container">
          <h1>About PotholeDetect</h1>
          <p>We're on a mission to make roads safer through innovative AI technology and community collaboration.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>To revolutionize road maintenance by providing an intelligent, community-driven platform that identifies, reports, and prioritizes pothole repairs using cutting-edge AI technology.</p>
          </div>
          <div className="mission-image">
            <div className="image-placeholder">🛣️</div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="how-we-work">
        <h2>How We Work</h2>
        <div className="process-grid">
          <div className="process-item">
            <div className="process-icon">👥</div>
            <h3>Community Reporting</h3>
            <p>Citizens report potholes using our easy-to-use mobile and web platform</p>
          </div>
          <div className="process-item">
            <div className="process-icon">🤖</div>
            <h3>AI Verification</h3>
            <p>Our advanced AI analyzes images to verify and categorize pothole severity</p>
          </div>
          <div className="process-item">
            <div className="process-icon">🎯</div>
            <h3>Smart Prioritization</h3>
            <p>Reports are automatically prioritized based on severity and location</p>
          </div>
          <div className="process-item">
            <div className="process-icon">🔧</div>
            <h3>Efficient Repairs</h3>
            <p>Maintenance teams receive organized reports for faster, targeted repairs</p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <h2>Our Impact</h2>
        <div className="impact-stats">
          <div className="stat-card">
            <h3>50,000+</h3>
            <p>Potholes Reported</p>
          </div>
          <div className="stat-card">
            <h3>35,000+</h3>
            <p>Repairs Completed</p>
          </div>
          <div className="stat-card">
            <h3>200+</h3>
            <p>Cities Served</p>
          </div>
          <div className="stat-card">
            <h3>98%</h3>
            <p>User Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-photo">👨‍💼</div>
            <h3>John Smith</h3>
            <p>CEO & Founder</p>
            <span>Transportation Technology Expert</span>
          </div>
          <div className="team-member">
            <div className="member-photo">👩‍💻</div>
            <h3>Sarah Johnson</h3>
            <p>CTO</p>
            <span>AI & Machine Learning Specialist</span>
          </div>
          <div className="team-member">
            <div className="member-photo">👨‍🔬</div>
            <h3>Mike Chen</h3>
            <p>Lead Engineer</p>
            <span>Computer Vision Expert</span>
          </div>
          <div className="team-member">
            <div className="member-photo">👩‍🎨</div>
            <h3>Lisa Davis</h3>
            <p>Product Designer</p>
            <span>UX/UI Design Leader</span>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-item">
            <h3>🌟 Innovation</h3>
            <p>We continuously push the boundaries of technology to solve real-world problems</p>
          </div>
          <div className="value-item">
            <h3>🤝 Community</h3>
            <p>We believe in the power of community collaboration to create positive change</p>
          </div>
          <div className="value-item">
            <h3>🛡️ Safety</h3>
            <p>Road safety is at the heart of everything we do</p>
          </div>
          <div className="value-item">
            <h3>🎯 Efficiency</h3>
            <p>We strive to make road maintenance faster and more effective</p>
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
              <li><a href="/">Home</a></li>
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

export default About;
