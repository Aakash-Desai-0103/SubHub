import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ import context
import './Navbar.css';
import logo from '../assets/logo.png';

function Navbar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isAuthenticated, logout } = useAuth(); // ✅ from context
  const navigate = useNavigate();

  // Update date/time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };

  const handleLogoClick = () => {
    // Redirect based on auth state
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/about');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* --- Conditional Logo Click Behavior --- */}
        <img
          src={logo}
          alt="SubHub Logo"
          className="navbar-logo-img"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/subscriptions">Subscriptions</NavLink></li>
            <li><NavLink to="/analytics">Analytics</NavLink></li>
            <li><NavLink to="/profile">Profile</NavLink></li>
            <li>
              <button 
                className="logout-btn"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/register">Register</NavLink></li>
          </>
        )}
      </ul>

      <div className="navbar-user">
        <div className="datetime-display">
          <span className="datetime-time">
            {currentDate.toLocaleTimeString('en-US', timeOptions)}
          </span>
          <span className="datetime-date">
            {currentDate.toLocaleDateString('en-US', dateOptions)}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
