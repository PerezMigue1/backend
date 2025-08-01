// middlewares/uploadCloudinary.middleware.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.config");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "productos",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
        transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto", fetch_format: "auto" }
        ],
        resource_type: "auto",
        public_id: (req, file) => {
            // Generar un nombre único para cada imagen
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            return `producto_${timestamp}_${randomString}`;

        }
    },
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
        files: 10 // Máximo 10 archivos
    },
    fileFilter: (req, file, cb) => {
        // Verificar tipo de archivo
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});

module.exports = upload;
