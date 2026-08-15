const Course = require("../models/Course");

// CREATE COURSE
// CREATE COURSE
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
    } = req.body;

    if (
      !title ||
      !description ||
      price === undefined
    ) {
      return res.status(400).json({
        message:
          "Title, Description and Price required",
      });
    }

    const course = new Course({
      title,
      description,
      price,
      imageUrl,
      videoUrls: [],
      pdfUrls: [],
    });

    await course.save();

    res.status(201).json({
      message:
        "Course created successfully",
      course,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ADD VIDEO
exports.addVideo = async (req, res) => {
  try {
    const course = await Course.findById(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No video uploaded",
      });
    }

    course.videoUrls.push({
      title: req.file.originalname,
      url: req.file.path,
    });

    await course.save();

    res.json({
      message: "Video uploaded successfully",
      course,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ADD PDF
exports.addPdf = async (req, res) => {
  try {
    const course = await Course.findById(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No PDF uploaded",
      });
    }

    course.pdfUrls.push({
      title: req.file.originalname,
      url: req.file.path,
    });

    await course.save();

    res.json({
      message: "PDF uploaded successfully",
      course,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET ALL COURSES
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({
      createdAt: -1,
    });

    res.json(courses);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET SINGLE COURSE
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ADD VIDEO URL
exports.addVideoUrl = async (req, res) => {
  try {
    const { videoUrl, title } = req.body;

    const course = await Course.findById(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    course.videoUrls.push({
      title,
      url: videoUrl,
    });

    await course.save();

    res.json({
      message: "Video saved successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};