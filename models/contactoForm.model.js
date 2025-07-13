const mongoose = require("mongoose");

const ContactoFormSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String },
    comentario: { type: String, required: true },
    idProducto: { type: String, required: true },
    idArtesano: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("ContactoForm", ContactoFormSchema, "contacto-form");
