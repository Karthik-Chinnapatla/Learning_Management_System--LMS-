const express = require("express");
const router = express.Router();

const {
  createLiveClass,
  getLiveClasses,
} = require(
  "../controllers/liveClassController"
);

// CREATE LIVE CLASS
router.post(
  "/create",
  createLiveClass
);

// GET ALL LIVE CLASSES
router.get(
  "/",
  getLiveClasses
);

module.exports = router;