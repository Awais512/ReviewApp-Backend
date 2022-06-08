import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

//Register User
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(400).json({ error: 'Email is already exist' });
  }
  const user = await User.create({ name, email, password });
  res.status(201).json(user);
});

//Login User
const login = asyncHandler(async (req, res) => {
  res.send('login');
});

export { register, login };
