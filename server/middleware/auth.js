const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        msg: "No token provided",
      });
    }

    // Expected:
    // Authorization: Bearer <token>

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        msg: "Token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);

    return res.status(401).json({
      msg: "Token invalid",
    });
  }
}

module.exports = auth;