const express = require('express');
const {
  register,
  login,
  verifyEmail,
  resendEmailVerificationToken,
} = require('../controllers/userController');
const { userValidtor, validate } = require('../middlewares/validator');

const router = express.Router();

router.post('/register', userValidtor, validate, register);
router.post('/login', login);
router.post('/verify', verifyEmail);
router.post('/resend-email-verification-token', resendEmailVerificationToken);

module.exports = router;
