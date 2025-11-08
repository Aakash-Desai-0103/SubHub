import React from 'react';
import { Link } from 'react-router-dom'; // <-- 1. IMPORT LINK AT THE TOP
import './WelcomeModal.css';

function WelcomeModal({ onClose }) {
  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <h2>Welcome to SubHub!</h2>
        <p>Here's a quick guide to get you started:</p>
        
        <ul className="modal-guide-list">
          <li>
            <strong>🏠 Dashboard:</strong> This is your home page. You'll see a summary of your costs, upcoming payments, and spending by category.
          </li>
          <li>
            <strong>📜 Subscriptions:</strong> This is your main list. Go here to see, edit, or delete all your subscriptions in one table.
          </li>
          <li>
            <strong>📊 Analytics:</strong> This page gives you a deep dive into your spending habits with charts and key metrics.
          </li>
          <li>
            <strong>👤 Profile:</strong> Go here to manage your account details or change settings.
          </li>
        </ul>

        {/* --- 2. THIS IS THE MODIFIED PARAGRAPH --- */}
        <p>
          To get started, head over to the 
          <Link 
            to="/subscriptions/new" 
            onClick={onClose} 
            className="modal-subscriptions-link"
          >
            Add New Subscription
          </Link> 
          page and add your first one!
        </p>
        
        <button className="modal-close-btn" onClick={onClose}>
          Got it, let's start!
        </button>
      </div>
    </>
  );
}

export default WelcomeModal;