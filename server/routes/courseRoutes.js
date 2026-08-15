const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createCourse,
  addVideo,
  addPdf,
  getCourses,
  getCourseById,
  addVideoUrl,
} = require("../controllers/courseController");

// CREATE COURSE
router.post("/add", createCourse);

// ADD VIDEO
router.post(
  "/:id/video",
  upload.single("video"),
  addVideo
);

// ADD PDF
router.post(
  "/:id/pdf",
  upload.single("pdf"),
  addPdf
);

// GET ALL COURSES
router.get("/", getCourses);

// GET SINGLE COURSE
router.get("/:id", getCourseById);

// ADD VIDEO URL
router.post(
  "/:id/video-url",
  addVideoUrl
);

module.exports = router;