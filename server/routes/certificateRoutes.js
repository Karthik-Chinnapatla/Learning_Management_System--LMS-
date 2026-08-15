const express = require("express");
const router = express.Router();

const {
  generateCertificate,
  getCertificates,
} = require(
  "../controllers/certificateController"
);

router.post(
  "/generate",
  generateCertificate
);

router.get(
  "/:email",
  getCertificates
);

module.exports = router;