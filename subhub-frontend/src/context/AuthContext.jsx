import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // <-- 1. IMPORT THE API SERVICE

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // This effect runs on app load and rehydrates state from local storage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // --- 2. UPDATED LOGIN FUNCTION ---
  const login = async (email, password) => {
    try {
      // Make the API call to your backend
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;

      // Save to local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update React state
      setToken(token);
      setUser(user);

      return true; // Return true on success
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return false; // Return false on failure
    }
  };

  // --- 3. NEW REGISTER FUNCTION ---
  const register = async (name, email, password) => {
    try {
      // Make the API call to your backend
      await api.post('/auth/register', { name, email, password });
      return true; // Return true on success
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      return false; // Return false on failure
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    register, // <-- 4. ADD REGISTER TO CONTEXT
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}