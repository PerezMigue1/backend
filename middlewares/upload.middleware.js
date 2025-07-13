const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // o donde desees guardar temporalmente
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split(".").pop();
        cb(null, `${Date.now()}.${ext}`);
    }
});

const upload = multer({ storage });

module.exports = upload;
