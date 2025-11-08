import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext'; // To conditionally show Navbar
import { Link } from 'react-router-dom'; // For public header
import './AboutPage.css';
import logo from '../assets/logo.png'; // For public header

function AboutPage() {
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const { isAuthenticated } = useAuth(); // Check if user is logged in

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', { contactName, contactMessage });
    setMessageSent(true);
    setContactName('');
    setContactMessage('');
  };

  // This is a simple header for non-logged-in users
  const PublicHeader = () => (
    <header className="public-about-header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="SubHub Logo" className="public-logo-img" />
        </Link>
      </div>
      <nav>
        <Link to="/login" className="btn btn-secondary">Login</Link>
        <Link to="/register" className="btn btn-primary">Get Started</Link>
      </nav>
    </header>
  );

  return (
    <>
      {/* Show Navbar if logged in, or PublicHeader if not */}
      {isAuthenticated ? <Navbar /> : <PublicHeader />}
      
      <div className="about-container">
        <div className="about-section">
          <h1>About SubHub</h1>
          <p>
            SubHub is a modern, full-stack web application designed to help you 
            take control of your recurring expenses. In an era of increasing 
            subscription services, many people lose track of their monthly and 
            annual payments, leading to wasted money.
          </p>
          <p>
            Our mission is to provide a single, intuitive dashboard where you 
            can add, track, manage, and analyze all your subscriptions, 
            empowering you to make better financial decisions.
          </p>
        </div>

        <div className="contact-section">
          <h2>Contact Us</h2>
          {messageSent ? (
            <div className="contact-success">
              Thank you! Your message has been sent.
            </div>
          ) : (
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label htmlFor="contactName">Your Name</label>
                <input type="text" id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="contactMessage">Message</label>
                <textarea id="contactMessage" rows="6" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} required />
              </div>
              <button type="submit" className="btn-submit-contact">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default AboutPage;