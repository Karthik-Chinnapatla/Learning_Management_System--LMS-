const mongoose = require("mongoose");

const certificateSchema =
  new mongoose.Schema({
    userName: {
      type: String,
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
    },

    courseTitle: {
      type: String,
      required: true,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  });

// One certificate per user per course
certificateSchema.index(
  {
    userEmail: 1,
    courseTitle: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.model(
    "Certificate",
    certificateSchema
  );