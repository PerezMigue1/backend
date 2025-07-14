// middlewares/uploadCloudinary.middleware.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.config");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "productos",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{ width: 800, height: 800, crop: "limit" }],
    },
});

const upload = multer({ storage });

module.exports = upload;
