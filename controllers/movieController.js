const asyncHandler = require("express-async-handler");
const Movie = require("../models/movieModel");

const uploadTrailer = asyncHandler(async (req, res) => {
  res.send("Send");
});

module.exports = { uploadTrailer };
