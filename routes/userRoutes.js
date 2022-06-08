const express = require('express');
const { register, login } = require('../controllers/userController');
const { userValidtor, validate } = require('../middlewares/validator');

const router = express.Router();

router.post('/register', userValidtor, validate, register);
router.post('/login', login);

module.exports = router;
