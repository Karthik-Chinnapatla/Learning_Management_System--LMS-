const express = require("express");

const router = express.Router();

const {
  register,
  login,
  googleLogin,
  getStudents,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const auth = require("../middleware/auth");

const upload = require("../middleware/upload");


// ========================================
// SIGNUP
// ========================================

router.post(
  "/signup",
  register
);


// ========================================
// NORMAL LOGIN
// ========================================

router.post(
  "/login",
  login
);


// ========================================
// GOOGLE LOGIN
// ========================================

router.post(
  "/google-login",
  googleLogin
);


// ========================================
// GET PROFILE
// ========================================

router.get(
  "/profile",
  auth,
  getProfile
);


// ========================================
// UPDATE PROFILE
// ========================================

router.put(
  "/profile",
  auth,
  upload.single("profileImage"),
  updateProfile
);


// ========================================
// GET ALL STUDENTS
// ADMIN ONLY
// ========================================

router.get(
  "/students",
  getStudents
);


module.exports = router;