const express = require("express");
const router = express.Router();

const Enrollment = require("../models/Enrollment");

router.get(
  "/check/:courseId/:userId",
  async (req, res) => {
    try {
      const enrollment =
        await Enrollment.findOne({
          courseId:
            req.params.courseId,
          userId:
            req.params.userId,
        });

      res.json({
        enrolled:
          !!enrollment,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

module.exports = router;