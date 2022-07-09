const express = require("express");
const {
  uploadTrailer,
  createMovie,
} = require("../controllers/movieController");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadVideo, uploadImage } = require("../middlewares/multer");

const router = express.Router();

router.post(
  "/upload-trailer",
  isAuth,
  isAdmin,
  uploadVideo.single("video"),
  uploadTrailer
);

router.post(
  "/create-movie",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  createMovie
);

module.exports = router;
