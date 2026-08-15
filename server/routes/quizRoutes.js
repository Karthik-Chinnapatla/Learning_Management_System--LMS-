const express = require("express");
const router = express.Router();

const {
  addQuiz,
  getQuizByCourse,
  generateQuizFromCourse,
} = require(
  "../controllers/quizController"
);

// ADD QUIZ
router.post(
  "/add",
  addQuiz
);

// GET QUIZ BY COURSE
router.get(
  "/:courseId",
  getQuizByCourse
);

router.post(
  "/generate/:courseId",
  generateQuizFromCourse
);

module.exports = router;