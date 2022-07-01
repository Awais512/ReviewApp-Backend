const asyncHandler = require("express-async-handler");
const Movie = require("../models/movieModel");
const { sendError } = require("../utils/helper");
const cloudinary = require("../cloud");

const uploadTrailer = asyncHandler(async (req, res) => {
  const { file } = req;
  if (!file) return sendError(res, "Video file is missing");
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      resource_type: "video",
    }
  );
  res.status(201).json({ url, public_id });
});

module.exports = { uploadTrailer };
