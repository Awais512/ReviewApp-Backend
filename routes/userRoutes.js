const express = require('express');
const {
  register,
  login,
  verifyEmail,
  resendEmailVerificationToken,
  forgotPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
} = require('../controllers/userController');
const { isVlidPsswordResetToken } = require('../middlewares/userMiddleware');
const {
  userValidtor,
  validatePassword,
  validate,
} = require('../middlewares/validator');

const router = express.Router();

router.post('/register', userValidtor, validate, register);
router.post('/login', login);
router.post('/verify', verifyEmail);
router.post('/resend-email-verification-token', resendEmailVerificationToken);
router.post('/forgot-password', forgotPassword);
router.post(
  '/verify-pass-reset-token',
  isVlidPsswordResetToken,
  (req, res, next) => {
    res.json({ valid: true });
  }
);
router.post(
  '/reset-password',
  validatePassword,
  validate,
  isVlidPsswordResetToken,
  resetPassword
);

module.exports = router;
