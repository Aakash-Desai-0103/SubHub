import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';
import logo from '../assets/logo.png';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Added this
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginSuccess = await auth.login(email, password);

      if (loginSuccess) {
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your email and password.');
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

        <h1>Welcome Back!</h1>
        <p>Log in to see your dashboard</p>

        {error && <div className="auth-error">{error}</div>}

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

        <div className="form-group password-group" style={{ position: 'relative' }}>
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'} // 👈 toggle input type
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{ paddingRight: '40px' }} // Space for eye icon
          />
          {/* 👇 Eye toggle button */}
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
              color: '#555'
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
