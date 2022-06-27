const asyncHandler = require("express-async-handler");
const Actor = require("../models/actorModel");
const {
  sendError,
  uploadImageToCloud,
  formatActor,
} = require("../utils/helper");
const { isValidObjectId } = require("mongoose");
const cloudinary = require("../cloud/index");

const createActor = asyncHandler(async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const newActor = new Actor({ name, about, gender });
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    newActor.avatar = { url, public_id };
  }
  await newActor.save();
  res.status(201).json(formatActor(newActor));
});

const updateActor = asyncHandler(async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!");

  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, "Invalid request, record not found!");

  const public_id = actor.avatar?.public_id;

  // remove old image if there was one!
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }

  // upload new avatar if there is one!
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    actor.avatar = { url, public_id };
  }

  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();

  res.status(201).json(formatActor(actor));
});

const deleteActor = asyncHandler(async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!");

  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, "Invalid request, record not found!");
  const public_id = actor.avatar?.public_id;
  // remove old image if there was one!
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }
  await Actor.findByIdAndDelete(actorId);
  res.json({ message: "Record removed Successfully" });
});

const searchActor = asyncHandler(async (req, res) => {
  const { query } = req;
  const result = await Actor.find({ $text: { $search: `"${query.name}"` } });

  const actors = result.map((actor) => formatActor(actor));

  res.json(actors);
});

const getLatestActors = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: "-1" }).limit(12);

  const actors = result.map((actor) => formatActor(actor));

  res.json(actors);
};

const getSingleActor = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, "Invalid request!");

  const actor = await Actor.findById(id);
  if (!actor) return sendError(res, "Invalid request, actor not found!", 404);
  res.json(formatActor(actor));
};

module.exports = {
  createActor,
  updateActor,
  deleteActor,
  searchActor,
  getLatestActors,
  getSingleActor,
};
