import React from 'react';
import './Contact.css';
import Navbar from '../navbar/Navbar.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar />

      {/* Contact Hero Section */}
      <section className="contact-hero">
        <div className="contact-container">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" required>
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="bug">Bug Report</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="6" required placeholder="Tell us how we can help you..."></textarea>
              </div>
              
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div className="contact-details">
                <h3>Email</h3>
                <p>info@potholedetect.com</p>
                <p>support@potholedetect.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
                <p>Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div className="contact-details">
                <h3>Office</h3>
                <p>123 Tech Street</p>
                <p>Innovation District</p>
                <p>San Francisco, CA 94105</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">🕒</div>
              <div className="contact-details">
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9AM - 6PM</p>
                <p>Saturday: 10AM - 4PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How does the AI verification work?</h3>
            <p>Our AI analyzes uploaded images using computer vision to automatically detect potholes and assess their severity level.</p>
          </div>
          <div className="faq-item">
            <h3>Is the app free to use?</h3>
            <p>Yes! PotholeDetect is completely free for citizens to report potholes and help improve road conditions.</p>
          </div>
          <div className="faq-item">
            <h3>How long does it take to get a response?</h3>
            <p>We typically respond to inquiries within 24 hours during business days. Critical issues are addressed immediately.</p>
          </div>
          <div className="faq-item">
            <h3>Can I track my pothole reports?</h3>
            <p>Yes, after creating an account, you can track the status of all your submitted reports through your dashboard.</p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h2>Find Us</h2>
        <div className="map-container">
          <div className="map-placeholder">
            <div className="map-icon">🗺️</div>
            <p>Interactive map showing our office location</p>
            <p>123 Tech Street, San Francisco, CA</p>
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

export default Contact;
