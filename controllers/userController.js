const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const EmailVerificationToken = require('../models/emailVerificationToken');
const PasswordResetToken = require('../models/passwordResetToken');
const { isValidObjectId } = require('mongoose');
const {
  generateOTP,
  generateMailTransporter,
} = require('../utils/generateOTP');
const { sendError, generateRandomByte } = require('../utils/helper');

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

  let OTP = generateOTP();

  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  var transport = generateMailTransporter();
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

  var transport = generateMailTransporter();
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
  if (!user) return sendError(res, 'user not found!');

  if (user.isVerified)
    return sendError(res, 'This email id is already verified!');

  const alreadyHasToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (alreadyHasToken)
    return sendError(
      res,
      'Only after one hour you can request for another token!'
    );

  // generate 6 digit otp
  let OTP = generateOTP();

  // store otp inside our db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  // send that otp to our user

  var transport = generateMailTransporter();

  transport.sendMail({
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Email Verification',
    html: `
      <p>Your verification OTP</p>
      <h1>${OTP}</h1>

    `,
  });

  res.json({
    message: 'New OTP has been sent to your registered email account.',
  });
});

//Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    sendError(res, 'Email is missing', 400);
  }
  const user = await User.findOne({ email });
  if (!user) {
    sendError(res, 'User not found', 404);
  }
  const hasToken = await PasswordResetToken.findOne({ owner: user._id });
  if (hasToken) {
    sendError(res, 'Only After one hour you can get token', 400);
  }
  const token = await generateRandomByte();
  const newPasswordResetToken = await PasswordResetToken({
    owner: user._id,
    token,
  });
  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;

  const transport = generateMailTransporter();

  transport.sendMail({
    from: 'security@reviewapp.com',
    to: user.email,
    subject: 'Reset Password Link',
    html: `
      <p>Click here to reset password</p>
      <a href='${resetPasswordUrl}'>Change Password</a>

    `,
  });

  res.json({ message: 'Link sent to your email!' });
});

//Login User
const login = asyncHandler(async (req, res) => {
  res.send('login');
});

module.exports = {
  register,
  login,
  verifyEmail,
  resendEmailVerificationToken,
  forgotPassword,
};
