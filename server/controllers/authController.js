const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);


// ========================================
// REGISTER
// ========================================

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      profileImage: "",
    });

    await user.save();

    res.status(201).json({
      msg: "Signup successful",
    });

  } catch (err) {
    console.error(
      "REGISTER ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};


// ========================================
// LOGIN
// ========================================

exports.login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid email or password",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        msg: "This account uses Google Login",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid email or password",
      });
    }

    const token =
      jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

    res.json({
      token,

      role: user.role,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage:
          user.profileImage || "",
      },
    });

  } catch (err) {
    console.error(
      "LOGIN ERROR:",
      err
    );

    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};


// ========================================
// GOOGLE LOGIN
// ========================================

exports.googleLogin = async (
  req,
  res
) => {
  try {
    const {
      credential,
    } = req.body;

    if (!credential) {
      return res.status(400).json({
        msg: "Google credential missing",
      });
    }

    const ticket =
      await client.verifyIdToken({
        idToken: credential,

        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    const payload =
      ticket.getPayload();

    const email =
      payload.email
        .trim()
        .toLowerCase();

    const name =
      payload.name;

    console.log(
      "GOOGLE EMAIL:",
      email
    );

    let user =
      await User.findOne({
        email,
      });

    if (!user) {
      console.log(
        "Google user does not exist. Creating student."
      );

      user =
        await User.create({
          name,
          email,
          password: "",
          role: "user",
          profileImage: "",
        });

    } else {
      console.log(
        "Existing user found:",
        user.email,
        "ROLE:",
        user.role
      );
    }

    const token =
      jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

    res.json({
      token,

      role: user.role,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage:
          user.profileImage || "",
      },
    });

  } catch (err) {
    console.error(
      "GOOGLE LOGIN ERROR:",
      err
    );

    res.status(500).json({
      msg: "Google Login Failed",
      error: err.message,
    });
  }
};


// ========================================
// GET PROFILE
// ========================================

exports.getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select(
        "-password"
      );

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    res.json({
      user,
    });

  } catch (err) {
    console.error(
      "GET PROFILE ERROR:",
      err
    );

    res.status(500).json({
      msg: "Unable to fetch profile",
      error: err.message,
    });
  }
};


// ========================================
// UPDATE PROFILE
// ========================================

exports.updateProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    // ====================================
    // UPDATE NAME
    // ====================================

    if (
      req.body.name !== undefined
    ) {
      const trimmedName =
        req.body.name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          msg: "Name cannot be empty",
        });
      }

      user.name = trimmedName;
    }

    // ====================================
    // UPDATE PROFILE IMAGE
    // ====================================

    if (req.file) {
      console.log(
        "PROFILE IMAGE:",
        req.file
      );

      // CloudinaryStorage normally
      // provides the uploaded URL
      user.profileImage =
        req.file.path ||
        req.file.secure_url ||
        "";
    }

    await user.save();

    res.json({
      msg: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage:
          user.profileImage || "",
      },
    });

  } catch (err) {
    console.error(
      "UPDATE PROFILE ERROR:",
      err
    );

    res.status(500).json({
      msg: "Unable to update profile",
      error: err.message,
    });
  }
};


// ========================================
// GET ALL STUDENTS
// ADMIN ONLY
// ========================================

exports.getStudents = async (
  req,
  res
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        msg: "Authentication required",
      });
    }

    const token =
      authHeader.split(" ")[1];

    let decoded;

    try {
      decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );
    } catch (error) {
      return res.status(401).json({
        msg: "Invalid or expired token",
      });
    }

    if (
      decoded.role !== "admin"
    ) {
      return res.status(403).json({
        msg: "Admin access required",
      });
    }

    const students =
      await User.find(
        {},
        {
          name: 1,
          email: 1,
          role: 1,
          profileImage: 1,
          createdAt: 1,
        }
      ).sort({
        createdAt: -1,
      });

    res.json({
      students,
    });

  } catch (err) {
    console.error(
      "GET STUDENTS ERROR:",
      err
    );

    res.status(500).json({
      msg: "Unable to fetch students",
      error: err.message,
    });
  }
};