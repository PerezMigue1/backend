// middlewares/cloudinary.middleware.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'Turi',
    api_key: '695826552543457',
    api_secret: 'zPC0tUocDhIWGTdMNfLuHfuhB7Q',
});

module.exports = cloudinary;
