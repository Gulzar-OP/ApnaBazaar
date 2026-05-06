import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// PROTECT
export const protect = async (req, res, next) => {
  let token;
  try {
    if (req.cookies.token) {
      token = req.cookies.token;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next();
    }

    return res.status(401).json({ message: 'Not authorized, no token' });

  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// ADMIN
export const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }

  next();
};