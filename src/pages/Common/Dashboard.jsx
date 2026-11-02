import React from 'react';
import './dashboard.css';
// import './Sidebar'
import Header from './header';
import Footer from './footer';
import '../../styles/width.css'

export default function Dashboard() {
    return (
        <div className="dashboard-wrapper widthbox">
            <Header />

            {/* Title Section */}
            <section className="title-section">
                <div className="title-container">
                    <h1 className="main-title">Welcome to Hostel Management System</h1>
                    <p className="subtitle">Your Complete Hostel Living Solution</p>
                </div>
            </section>

            {/* About Us Section */}
            <section className="about-section">
                <div className="container">
                    <h2>About Us</h2>
                    <div className="about-content">
                        <p>
                            The Hostel Management System is designed to streamline all aspects of hostel operations,
                            providing students with a seamless experience for managing their accommodation needs.
                        </p>
                        <p>
                            Our system offers comprehensive features including room allocation, complaint management,
                            mess services, leave applications, and real-time communication with hostel administration.
                        </p>
                        <div className="features-list">
                            <h3>Key Features:</h3>
                            <ul>
                                <li>Room Management & Allocation</li>
                                <li>Complaint Management System</li>
                                <li>Mess Services & Menu</li>
                                <li>Leave Application Processing</li>
                                <li>Medical Issue Reporting</li>
                                <li>Real-time Announcements</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section className="contact-section">
                <div className="container">
                    <h2>Contact Us</h2>
                    <div className="contact-content">
                        <div className="contact-card">
                            <h3>Office Contact</h3>
                            <p>
                                <strong>Email:</strong>{' '}
                                <a href="mailto:hostel@university.edu">hostel@university.edu</a>
                            </p>
                            <p>
                                <strong>Phone:</strong>{' '}
                                <a href="tel:+919876543210">+91-9876543210</a>
                            </p>
                            <p>
                                <strong>Address:</strong> Hostel Complex, University Campus
                            </p>
                        </div>

                        <div className="contact-card">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="#complaints">Report Complaint</a></li>
                                <li><a href="#mess">View Mess Menu</a></li>
                                <li><a href="#leave">Apply for Leave</a></li>
                                <li><a href="#announcements">View Announcements</a></li>
                            </ul>
                        </div>

                        <div className="contact-card">
                            <h3>Emergency</h3>
                            <p>
                                <strong>Duty Officer (24/7):</strong>{' '}
                                <a href="tel:+919999999999">+91-9999999999</a>
                            </p>
                            <p className="emergency-note">
                                For urgent matters, please contact the duty officer
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}