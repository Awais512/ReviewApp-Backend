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
const { isAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  createActor
);

router.post(
  "/:actorId",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  updateActor
);

router.delete("/:actorId", isAuth, isAdmin, deleteActor);
router.get("/search", isAuth, isAdmin, searchActor);
router.get("/", isAuth, isAdmin, getLatestActors);
router.get("/:id", getSingleActor);

module.exports = router;
