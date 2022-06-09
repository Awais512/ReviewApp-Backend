const express = require('express');
const {
  register,
  login,
  verifyEmail,
  resendEmailVerificationToken,
  forgotPassword,
} = require('../controllers/userController');
const { isVlidPsswordResetToken } = require('../middlewares/userMiddleware');
const { userValidtor, validate } = require('../middlewares/validator');

const router = express.Router();

router.post('/register', userValidtor, validate, register);
router.post('/login', login);
router.post('/verify', verifyEmail);
router.post('/resend-email-verification-token', resendEmailVerificationToken);
router.post('/forgot-password', forgotPassword);
router.post('/verify-pass-reset-token', isVlidPsswordResetToken, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;
