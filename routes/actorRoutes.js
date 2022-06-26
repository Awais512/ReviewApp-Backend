const express = require("express");
const { createActor } = require("../controllers/actorController");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validator");

const router = express.Router();

router.post(
  "/",
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  createActor
);

module.exports = router;
