const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate token and set cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret_for_dev',
    { expiresIn: '7d' }
  );

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        requestedRole: user.requestedRole
      }
    });
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with that email or username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      hashedPassword,
      role: 'unassigned'
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body; // allow login by email or username

    const user = await User.findOne({ 
      $or: [{ email: email }, { username: email }] 
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/google/verify
exports.googleVerify = async (req, res, next) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ success: false, error: 'Missing id_token' });
    }

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        username: name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000), // Generate a fallback username
        email,
        googleId,
        role: 'unassigned'
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      await user.save();
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({ success: false, error: `Invalid Google token: ${err.message}` });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-hashedPassword');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        requestedRole: user.requestedRole
      }
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/onboard
exports.onboard = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['production_staff', 'warehouse_supervisor', 'lab_admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role selection' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    user.requestedRole = role;
    user.status = 'pending_approval';
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        requestedRole: user.requestedRole
      }
    });
  } catch (err) {
    next(err);
  }
};
