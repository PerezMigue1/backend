const mongoose = require("mongoose");

const ContactoRestauranteSchema = new mongoose.Schema({
    idUsuario: { type: String, required: true },
    idRestaurante: { type: String, required: true, unique: true },
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

module.exports = mongoose.model("ContactoRestaurante", ContactoRestauranteSchema, "contacto-restaurante"); 