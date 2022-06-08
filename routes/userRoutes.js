const express = require('express');
const {
  register,
  login,
  verifyEmail,
} = require('../controllers/userController');
const { userValidtor, validate } = require('../middlewares/validator');

const router = express.Router();

router.post('/register', userValidtor, validate, register);
router.post('/login', login);
router.post('/verify', verifyEmail);

module.exports = router;
