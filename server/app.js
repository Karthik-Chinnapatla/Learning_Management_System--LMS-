const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

const PORT =
  process.env.PORT || 5000;


// ========================================
// CORS
// ========================================

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
  })
);


// ========================================
// BODY PARSER
// ========================================

app.use(
  express.json()
);


// ========================================
// STATIC UPLOADS
// ========================================

app.use(
  "/uploads",
  express.static("uploads")
);


// ========================================
// ROOT
// ========================================

app.get("/", (req, res) => {
  res.send(
    "LMS API is running..."
  );
});


// ========================================
// MONGODB
// ========================================

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log(
      "MongoDB connected"
    );
  })
  .catch((err) => {
    console.error(
      "MongoDB connection error:",
      err
    );
  });


// ========================================
// ROUTES
// ========================================

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/courses",
  require("./routes/courseRoutes")
);

app.use(
  "/api/quizzes",
  require("./routes/quizRoutes")
);

app.use(
  "/api/certificates",
  require("./routes/certificateRoutes")
);

app.use(
  "/api/liveclasses",
  require("./routes/liveClassRoutes")
);

app.use(
  "/api/payment",
  require("./routes/paymentRoutes")
);

app.use(
  "/api/enrollments",
  require("./routes/enrollmentRoutes")
);


// ========================================
// START SERVER
// ========================================

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);