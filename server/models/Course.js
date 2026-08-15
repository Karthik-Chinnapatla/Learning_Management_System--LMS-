const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    default: 0,
  },

  imageUrl: {
    type: String,
    default: "",
  },

  videoUrls: [
    {
      title: String,
      url: String,
    },
  ],

  pdfUrls: [
    {
      title: String,
      url: String,
    },
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Course",
  courseSchema
);