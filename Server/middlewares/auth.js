import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Check if JWT_SECRET is configured
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not configured');
        return res.status(500).json({ message: 'Server configuration error' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check database connection before querying
      if (mongoose.connection.readyState !== 1) {
        console.error('Database not connected in auth middleware. ReadyState:', mongoose.connection.readyState);
        return res.status(503).json({ message: 'Database not connected' });
      }

      // Get user from token
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbError) {
        console.error('Database error in auth middleware:', dbError);
        return res.status(503).json({ 
          message: 'Database error',
          error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        });
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      // Handle database errors
      if (error.name === 'MongoError' || error.name === 'MongooseError') {
        return res.status(503).json({ 
          message: 'Database error',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin only middleware
export const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, please login first' });
  }
  
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Not authorized as an admin',
      userRole: req.user.role 
    });
  }
};

// Farmer only middleware
export const farmer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, please login first' });
  }

  if (req.user.role === 'farmer') {
    next();
  } else {
    res.status(403).json({
      message: 'Not authorized as a farmer',
      userRole: req.user.role,
    });
  }
};

