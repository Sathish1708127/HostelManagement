import React from 'react';
import './dashboard.css';

function Footer(){
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Hostel Management System</h3>
          <p>&copy; 2026 All rights reserved</p>
        </div>

        <div className="footer-section">
          <h4>Warden Information</h4>
          <p className="warden-name">
            <strong>Warden:</strong> Dr. Rajesh Kumar
          </p>
          <p className="warden-info">
            <strong>Office Hours:</strong> Mon-Fri, 10:00 AM - 5:00 PM
          </p>
        </div>

        <div className="footer-section">
          <h4>Contact Details</h4>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:warden@hostel.edu">warden@hostel.edu</a>
          </p>
          <p>
            <strong>Phone:</strong>{' '}
            <a href="tel:+919876543210">+91-9876543210</a>
          </p>
          <p>
            <strong>Address:</strong> Hostel Complex, University Campus
          </p>
        </div>

        <div className="footer-section">
          <h4>Emergency Contact</h4>
          <p>
            <strong>Duty Officer:</strong>{' '}
            <a href="tel:+919999999999">+91-9999999999</a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>For any queries, please contact the warden's office</p>
      </div>
    </footer>
  );
}

export default Footer;
