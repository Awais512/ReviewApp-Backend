const express = require("express");
const { createActor } = require("../controllers/actorController");

const router = express.Router();

router.post("/", createActor);

module.exports = router;
