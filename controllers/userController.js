import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

//Register User
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json(user);
});

//Login User
const login = asyncHandler(async (req, res) => {
  res.send('login');
});

export { register, login };
