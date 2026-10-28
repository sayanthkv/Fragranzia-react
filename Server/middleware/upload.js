// middleware/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../Config/cloudinary"); // Adjust path to step 3 file

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "project_two_uploads", // <-- Cloudinary creates this folder automatically
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;