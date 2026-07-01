const User = require('../models/User.model');

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me (Just a dummy for frontend validation if needed)
exports.getMe = async (req, res, next) => {
  // Normally this would parse a token. For our simplified session flow where
  // the frontend holds the user state in sessionStorage, this isn't strictly necessary,
  // but we can provide a dummy or just return 401 to force frontend token logic.
  res.status(200).json({ success: true, message: 'Please rely on frontend sessionStorage for user state in this demo.' });
};
