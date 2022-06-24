const express = require("express");
const {
  register,
  login,
  verifyEmail,
  resendEmailVerificationToken,
  forgotPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
} = require("../controllers/userController");
const { isAuth } = require("../middlewares/auth");
const { isVlidPsswordResetToken } = require("../middlewares/userMiddleware");
const {
  userValidtor,
  validatePassword,
  validate,
  signInValidator,
} = require("../middlewares/validator");

const router = express.Router();

router.post("/register", userValidtor, validate, register);
router.post("/login", signInValidator, validate, login);
router.post("/verify", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forgot-password", forgotPassword);
router.post(
  "/verify-pass-reset-token",
  isVlidPsswordResetToken,
  (req, res, next) => {
    res.json({ valid: true });
  }
);
router.post(
  "/reset-password",
  validatePassword,
  validate,
  isVlidPsswordResetToken,
  resetPassword
);

router.get("/is-auth", isAuth, (req, res) => {
  const { user } = req;
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    },
  });
});

module.exports = router;
