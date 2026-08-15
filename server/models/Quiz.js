const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  question: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true }
});

module.exports = mongoose.model("Quiz", quizSchema);
