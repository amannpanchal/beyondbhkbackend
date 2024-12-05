// Import required modules
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer, specifying folder and allowed formats
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Properties", // Folder name in Cloudinary where files will be stored
    // allowed_formats: ["jpg", "png", "jpeg", "gif", "pdf", "mp4"], // Allowed file types
    resource_type: "auto", // Allows both image and video types
  },
});

// Set up multer with storage and optional file size limit
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Optional: 50 MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "video/mp4",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(
        new Error(
          "Unsupported file format. Please upload jpg, png, gif, pdf, or mp4 files only."
        ),
        false
      ); // Reject the file
    }
  },
});

// Export configured cloudinary and upload middleware
module.exports = { cloudinary, upload };
