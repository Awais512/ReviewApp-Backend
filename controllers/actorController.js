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

module.exports = { createActor };
