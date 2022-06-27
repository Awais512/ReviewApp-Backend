const express = require("express");
const {
  createActor,
  updateActor,
  deleteActor,
  searchActor,
  getLatestActors,
  getSingleActor,
} = require("../controllers/actorController");
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

router.post(
  "/:actorId",
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  updateActor
);

router.delete("/:actorId", deleteActor);
router.get("/search", searchActor);
router.get("/", getLatestActors);
router.get("/:id", getSingleActor);

module.exports = router;
