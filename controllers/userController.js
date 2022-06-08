import asyncHandler from 'express-async-handler';

//Register User
const register = asyncHandler(async (req, res) => {
  res.send('Register');
});

//Login User
const login = asyncHandler(async (req, res) => {
  res.send('login');
});

export { register, login };
