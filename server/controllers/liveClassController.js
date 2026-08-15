const LiveClass = require("../models/LiveClass");

// CREATE LIVE CLASS
exports.createLiveClass = async (req, res) => {
  try {
    const newClass = await LiveClass.create(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Live class created",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL LIVE CLASSES
exports.getLiveClasses = async (
  req,
  res
) => {
  try {
    const classes =
      await LiveClass.find();

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};