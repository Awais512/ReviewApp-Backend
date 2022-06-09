const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const EmailVerificationToken = require('../models/emailVerificationToken');
const nodemailer = require('nodemailer');
const { isValidObjectId } = require('mongoose');

//Register User
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(400).json({ error: 'Email is already exist' });
  }
  const user = new User({ name, email, password });
  await user.save();
  // generate 6 digit OTP

  let OTP = '';
  for (let i = 0; i <= 5; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  var transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
  transport.sendMail({
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Email Verification',
    html: `
    <p>Your Verification OTP</p>
    <p>${OTP}</p>

    `,
  });
  res.status(201).json({
    message: 'Please Verify your Email. OTP has been sent to your email...',
  });
});

//Verify Email
const verifyEmail = asyncHandler(async (req, res) => {
  const { userId, OTP } = req.body;
  if (!isValidObjectId(userId)) {
    res.status(400).json({ error: 'Invalid User' });
  }
  const user = await User.findById(userId);

  if (!user) {
    res.status(400).json({ error: 'User Not Found' });
  }
  if (user.isVerified) {
    return res.status(400).json({ error: 'User is already Verified' });
  }
  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) {
    res.status(400).json({ error: 'Token is invalid or Expire' });
  }
  const isMatched = await token.compareToken(OTP);
  if (!isMatched) {
    return res.status(400).json({ error: 'Invalid OTP...' });
  }
  user.isVerified = true;
  await user.save();
  await EmailVerificationToken.findByIdAndDelete(token._id);

  var transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
  transport.sendMail({
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Email Verified',
    html: `
    <h1>Welcome to Our app.</h1>
    `,
  });
  res.status(200).json({ message: 'Your Email has been verified' });
});

//Resend Email Verification Token
const resendEmailVerificationToken = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.isVerified) {
    return res.status(404).json({ error: 'Email is already verified' });
  }
  const hastoken = await EmailVerificationToken.findByIdAndDelete(token._id);
  if (hastoken) {
    return res.status(404).json({
      error: 'Only after one hour You can request a new token after one hour',
    });
  }

  let OTP = '';
  for (let i = 0; i <= 5; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  var transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
  transport.sendMail({
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Email Verification',
    html: `
    <p>Your Verification OTP</p>
    <p>${OTP}</p>

    `,
  });
  res.status(201).json({
    message: 'Please Verify your Email. OTP has been sent to your email...',
  });
});

//Login User
const login = asyncHandler(async (req, res) => {
  res.send('login');
});

module.exports = { register, login, verifyEmail, resendEmailVerificationToken };
