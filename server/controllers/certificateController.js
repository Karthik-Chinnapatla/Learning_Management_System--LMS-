const Certificate = require("../models/Certificate");

// GENERATE CERTIFICATE
exports.generateCertificate = async (req, res) => {
  try {
    const {
      userName,
      userEmail,
      courseTitle,
    } = req.body;

    // Check if certificate already exists
    const existingCertificate =
      await Certificate.findOne({
        userEmail,
        courseTitle,
      });

    if (existingCertificate) {
      return res.status(200).json({
        message:
          "Certificate already exists.",
      });
    }

    const cert = new Certificate({
      userName,
      userEmail,
      courseTitle,
      completedAt: new Date(),
    });

    await cert.save();

    res.status(201).json({
      message:
        "Certificate generated successfully.",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        "Error generating certificate.",
    });

  }
};

// GET USER CERTIFICATES
exports.getCertificates = async (
  req,
  res
) => {
  try {

    const certs =
      await Certificate.find({
        userEmail:
          req.params.email,
      });

    res.json(certs);

  } catch (err) {

    res.status(500).json({
      message:
        "Error fetching certificates.",
    });

  }
};