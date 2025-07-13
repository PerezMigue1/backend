const mongoose = require("mongoose");

const ContactoArtesanoSchema = new mongoose.Schema({
    idArtesano: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String },
    ubicacion: { type: String },
    especialidad: { type: String },
    redesSociales: {
        facebook: { type: String },
        instagram: { type: String },
        whatsapp: { type: String }
    },
    descripcion: { type: String },
    imagenPerfil: { type: String },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

module.exports = mongoose.model("ContactoArtesano", ContactoArtesanoSchema, "contacto-artesano");
