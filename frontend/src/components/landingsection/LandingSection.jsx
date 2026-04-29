import React from 'react';
import { Link } from 'react-router-dom';
import './LandingSection.css';

const LandingSection = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-container">
        <div className="hero-content">
          <div className="hero-left">
            <h1>Smart Road Analysis &amp; Pothole Detection</h1>
            <p>Report potholes with AI-powered verification, automatic location tracking, and priority routing for safer roads.</p>
            <div className="hero-buttons">
              <Link to="/report" className="primary-btn">Report a Pothole</Link>
              <Link to="/dashboard" className="secondary-btn">View Dashboard</Link>
            </div>
          </div>
          <div className="hero-right">
            <img src="/hero_illustration.png" alt="Smart Pothole Detection" className="hero-image" />
          </div>
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
