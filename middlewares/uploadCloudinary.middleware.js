// middlewares/uploadCloudinary.middleware.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.config");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "productos",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
        transformation: [{ width: 800, height: 800, crop: "limit" }],
        resource_type: "auto"
    },
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
        files: 10 // Máximo 10 archivos
    },
    fileFilter: (req, file, cb) => {
        console.log("🔍 Validando archivo:", file.originalname, "Tipo:", file.mimetype);
        
        // Verificar tipo de archivo
        if (file.mimetype.startsWith('image/')) {
            console.log("✅ Archivo válido:", file.originalname);
            cb(null, true);
        } else {
            console.log("❌ Archivo inválido:", file.originalname, "Tipo:", file.mimetype);
            cb(new Error(`Solo se permiten archivos de imagen. Archivo: ${file.originalname}`), false);
        }
    }
});

// Middleware para manejar errores de multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        console.error("❌ Error de Multer:", error);
        
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: "Archivo demasiado grande",
                error: "El archivo excede el límite de 5MB"
            });
        }
        
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                message: "Demasiados archivos",
                error: "Máximo 10 archivos permitidos"
            });
        }
        
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                message: "Campo de archivo inesperado",
                error: "Verifica el nombre del campo de archivo"
            });
        }
        
        return res.status(400).json({
            message: "Error al subir archivos",
            error: error.message
        });
    }
    
    if (error) {
        console.error("❌ Error general:", error);
        return res.status(400).json({
            message: "Error al procesar archivos",
            error: error.message
        });
    }
    
    next();
};

module.exports = { upload, handleMulterError };
