import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';
import logo from '../assets/logo.png';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Added
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👈 Added
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreed) {
      setError('You must agree to the terms and conditions');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const registerSuccess = await register(name, email, password);

      if (registerSuccess) {
        sessionStorage.setItem('showWelcome', 'true');
        navigate('/login');
      } else {
        setError('Registration failed. This email may already be in use.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <Link to="/about" className="auth-logo-link">
          <div className="auth-logo">
            <img src={logo} alt="SubHub Logo" />
            <p className="auth-tagline">The Hub for all your subs</p>
          </div>
        </Link>

        <h1>Create Your Account</h1>
        <p>Manage your subscriptions efficiently</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* PASSWORD FIELD */}
        <div className="form-group password-group" style={{ position: 'relative' }}>
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="8"
            disabled={loading}
            style={{ paddingRight: '40px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password-btn"
            style={{
              position: 'absolute',
              right: '10px',
              top: '36px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#555',
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* CONFIRM PASSWORD FIELD */}
        <div className="form-group password-group" style={{ position: 'relative' }}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            style={{ paddingRight: '40px' }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="toggle-password-btn"
            style={{
              position: 'absolute',
              right: '10px',
              top: '36px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#555',
            }}
          >
            {showConfirmPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="form-group-check">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="terms">
            I agree to the{' '}
            <Link to="/terms" target="_blank">
              Terms and Conditions
            </Link>
          </label>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
