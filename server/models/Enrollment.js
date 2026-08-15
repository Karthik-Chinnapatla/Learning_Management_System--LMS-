const mongoose = require("mongoose");

const enrollmentSchema =
  new mongoose.Schema({
    userId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    paymentId: String,

    amount: Number,

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports = mongoose.model(
  "Enrollment",
  enrollmentSchema
);