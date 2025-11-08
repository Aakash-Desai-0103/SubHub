import axios from 'axios';

// 1. Create a new axios instance
const api = axios.create({
  // Use the backend URL from your server.js
  baseURL: 'http://localhost:5000/api', 
});

// 2. Add an "interceptor" to attach the token to every request
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default api;