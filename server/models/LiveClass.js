const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema({
  title: String,
  description: String,
  roomId: String,
  date: String,
  time: String,
});

module.exports = mongoose.model("LiveClass", liveClassSchema);