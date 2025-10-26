import React from 'react';
import { Link } from 'react-router-dom';
import './LandingSection.css';

const LandingSection = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <h1>Smart Pothole Detection System</h1>
        <p>Report potholes with AI-powered verification, automatic location tracking, and priority-based assignment to ensure safer roads for everyone.</p>
        <div className="hero-buttons">
          <Link to="/report" className="orange-btn">📸 Report a Pothole</Link>
          <Link to="/dashboard" className="outline-btn">View Dashboard</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="card blue-card">
          <div className="icon">🛡️</div>
          <h3>AI Verification</h3>
          <p>Advanced machine learning model automatically verifies pothole images and determines severity levels for accurate reporting.</p>
        </div>
        <div className="card orange-card">
          <div className="icon">📍</div>
          <h3>Auto Location</h3>
          <p>GPS coordinates are automatically captured when you upload a photo, ensuring precise location data for repair teams.</p>
        </div>
        <div className="card green-card">
          <div className="icon">⚠️</div>
          <h3>Smart Priority</h3>
          <p>Intelligent priority assignment based on severity, highway type, and location ensures critical repairs are addressed first.</p>
        </div>
      </section>
    </>
  );
};

export default LandingSection;
