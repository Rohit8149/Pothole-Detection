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

    </div>
  );
};

export default HomePage;
