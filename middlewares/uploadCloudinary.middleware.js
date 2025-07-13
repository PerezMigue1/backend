// middlewares/uploadCloudinary.middleware.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.config");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "artesanos", // Carpeta en tu cuenta de Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
});

const upload = multer({ storage });

module.exports = upload;
