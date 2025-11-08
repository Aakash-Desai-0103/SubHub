import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import logo from '../assets/logo.png';
import logoCollage from '../assets/Combined.png'; 

function LandingPage() {
  return (
    <div className="landing-page">
      {/* ===== HEADER ===== */}
      <header className="landing-header">
        
        {/* --- MODIFIED SECTION --- */}
        <Link to="/about" className="logo-container">
          <img src={logo} alt="SubHub Logo" className="landing-logo-img" />
        </Link>
        {/* --- END MODIFICATION --- */}

        <h2 className="header-main-tagline">
          All your subs managed in one single Hub
        </h2>

        <nav>
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </nav>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="landing-main">
        {/* --- Hero Section --- */}
        <section className="hero">
          <div className="hero-content">
            <h1>Take control of your subscriptions.</h1>
            <p>
              Track, manage, and optimize all your recurring
              payments in one beautiful dashboard.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Now
            </Link>
          </div>
          {/* --- This container now has the hover effect --- */}
          <div className="hero-image">
            <img 
              src={logoCollage} 
              alt="Subscription collage" 
              className="hero-image-preview" 
            />
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="features">
          <Link to="/subscriptions" className="feature">
            <h3>Track All Subs</h3>
            <p>From streaming to software, see everything in one place.</p>
          </Link>
          <Link to="/analytics" className="feature">
            <h3>Smart Analytics</h3>
            <p>Get clear insights into your spending habits.</p>
          </Link>
          <Link to="/dashboard" className="feature">
            <h3>Payment Reminders</h3>
            <p>Never forget a due date again. Get smart reminders.</p>
          </Link>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <p>© 2025 SubHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;