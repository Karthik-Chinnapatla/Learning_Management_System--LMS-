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

const PORT = process.env.PORT || 5000;


// ========================================
// ALLOWED FRONTEND ORIGINS
// ========================================

const allowedOrigins = [
  "http://localhost:3000",
  "https://learning-management-system-lms-kappa.vercel.app",
];


// ========================================
// CORS
// ========================================

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests without an Origin header
      // such as Postman or server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        "CORS BLOCKED ORIGIN:",
        origin
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    optionsSuccessStatus: 204,
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