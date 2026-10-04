const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('fullname').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('phone').isMobilePhone('en-IN').withMessage('Invalid phone number'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    next();
  }
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    next();
  }
];