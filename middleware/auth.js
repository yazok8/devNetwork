// middleware/auth.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  console.log('Middleware received token:', token);
  console.log('All headers:', req.headers);

  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


module.exports = auth;
