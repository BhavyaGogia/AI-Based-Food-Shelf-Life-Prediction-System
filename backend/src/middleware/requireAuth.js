const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const requireAuth = async (req, res, next) => {
  try {
    // 1. Extract token from cookie (primary) or Authorization header (fallback)
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev');

    // 3. Find user and attach to request
    const user = await User.findById(decoded.id).select('-hashedPassword');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'The user belonging to this token no longer exists.'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Your account access has been suspended or rejected.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, token failed'
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user ? req.user.role : 'none'} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { requireAuth, authorizeRoles };
