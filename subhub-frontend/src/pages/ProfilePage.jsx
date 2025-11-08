import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './ProfilePage.css';

function ProfilePage() {
  const { user, logout, login } = useAuth();

  // State for forms
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emailReminders, setEmailReminders] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // 👁️
  const [showNewPassword, setShowNewPassword] = useState(false); // 👁️

  // UI State
  const [message, setMessage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setMessage('');
    try {
      const res = await api.put('/auth/profile', { name: fullName });
      const updatedUser = { ...user, name: res.data.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(updatedUser, localStorage.getItem('token'));
      setMessage('Profile updated successfully!');
    } catch {
      setMessage('Failed to update profile.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setMessage('Settings saved!');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    setMessage('');
    try {
      await api.post('/auth/password', { currentPassword, newPassword });
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure? This will delete all your data permanently.')) {
      try {
        await api.delete('/auth/account');
        logout();
      } catch {
        setMessage('Failed to delete account.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h1>Profile & Settings</h1>

        {message && <div className="profile-message">{message}</div>}

        <div className="profile-section">
          <h2>Account Information</h2>
          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} disabled />
            </div>
            <button type="submit" className="btn-save" disabled={loadingProfile}>
              {loadingProfile ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="profile-section">
          <h2>Notification Preferences</h2>
          <form onSubmit={handleSaveSettings}>
            <div className="form-check">
              <input
                type="checkbox"
                id="emailReminders"
                checked={emailReminders}
                onChange={(e) => setEmailReminders(e.target.checked)}
              />
              <label htmlFor="emailReminders">
                Email reminders for upcoming payments
              </label>
            </div>
            <button type="submit" className="btn-save">
              Save Settings
            </button>
          </form>
        </div>

        <div className="profile-section">
          <h2>Change Password</h2>
          <form onSubmit={handleChangePassword}>
            {/* CURRENT PASSWORD */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                {showCurrentPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* NEW PASSWORD */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="newPassword">New Password</label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
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
                {showNewPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button type="submit" className="btn-save" disabled={loadingPassword}>
              {loadingPassword ? 'Saving...' : 'Change Password'}
            </button>
          </form>
        </div>

        <div className="profile-section danger-zone">
          <h2>Danger Zone</h2>
          <p>This action is irreversible and will delete all your data.</p>
          <button className="btn-delete" onClick={handleDeleteAccount}>
            Delete My Account
          </button>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
