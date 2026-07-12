const { body } = require('express-validator');

exports.validateRegister = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

exports.validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email/Username is required')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];
