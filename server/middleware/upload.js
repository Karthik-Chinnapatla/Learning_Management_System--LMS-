const multer = require("multer");

const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    let uploadOptions = {
      folder: "lms_uploads",
      public_id:
        Date.now() +
        "-" +
        file.originalname
          .split(".")[0]
          .replace(/\s+/g, "-"),
    };

    // PDF
    if (file.mimetype === "application/pdf") {
      uploadOptions.resource_type = "raw";
    }

    // VIDEO
    else if (file.mimetype.startsWith("video")) {
      uploadOptions.resource_type = "video";
    }

    // IMAGE
    else if (file.mimetype.startsWith("image")) {
      uploadOptions.resource_type = "image";
    }

    return uploadOptions;
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 500 * 1024 * 1024,
  },
});

module.exports = upload;