import React from 'react';
import { Link } from 'react-router-dom';
import './TermsPage.css'; // We'll add this CSS file

function TermsPage() {
  return (
    <div className="terms-container">
      <div className="terms-box">
        <h1>Terms and Conditions for SubHub</h1>
        <p><strong>Last Updated:</strong> October 31, 2025</p>

        <p>
          Welcome to SubHub! These terms and conditions outline the rules and
          regulations for the use of SubHub's Website, located at
          localhost:5173.
        </p>
        <p>
          By accessing this website we assume you accept these terms and
          conditions. Do not continue to use SubHub if you do not agree to
          take all of the terms and conditions stated on this page.
        </p>

        <h2>1. License</h2>
        <p>
          Unless otherwise stated, SubHub and/or its licensors own the
          intellectual property rights for all material on SubHub. All
          intellectual property rights are reserved. You may access this from
          SubHub for your own personal use subjected to restrictions set in
          these terms and conditions.
        </p>
        <p>You must not:</p>
        <ul>
          <li>Republish material from SubHub</li>
          <li>Sell, rent or sub-license material from SubHub</li>
          <li>Reproduce, duplicate or copy material from SubHub</li>
          <li>Redistribute content from SubHub</li>
        </ul>

        <h2>2. User Data</h2>
        <p>
          Our app is designed to store your subscription data. You are
          responsible for maintaining the accuracy and security of this
          data. We are not responsible for any data loss that may occur.
        </p>

        <h2>3. Limitation of Liability</h2>
        <p>
          In no event shall SubHub, nor any of its officers, directors and
          employees, be held liable for anything arising out of or in any
          way connected with your use of this Website whether such
          liability is under contract. SubHub shall not be held liable
          for any indirect, consequential or special liability arising out
          of or in any way related to your use of this Website.
        </p>

        <Link to="/register" className="back-button">
          &larr; Back to Register
        </Link>
      </div>
    </div>
  );
}

export default TermsPage;