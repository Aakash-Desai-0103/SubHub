// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Dev bypass: only active when NODE_ENV === 'development' AND header x-dev-user: true
  if (process.env.NODE_ENV === 'development' && req.headers['x-dev-user'] === 'true') {
    try {
      const devUser = await User.findOne({ email: 'dev@local' }).select('-password');
      if (devUser) {
        req.user = devUser;
        return next();
      }
      // If dev user doesn't exist, fall through to normal auth flow
    } catch (err) {
      console.error('Dev bypass error:', err);
      // continue to normal token check
    }
  }

  // Normal JWT auth flow
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
