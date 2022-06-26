const asyncHandler = require("express-async-handler");
const Actor = require("../models/actorModel");
const { sendError, generateRandomByte } = require("../utils/helper");

const createActor = asyncHandler(async (req, res) => {
  res.send("Actor Created");
});

module.exports = { createActor };
