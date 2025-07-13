const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
    idProducto: { type: String, required: true, unique: true },
    Nombre: { type: String, required: true },
    Imagen: [{ type: String, required: true }],
    Precio: { type: Number, required: true },
    Descripción: { type: String },
    Dimensiones: { type: String },
    Colores: { type: String },
    Etiquetas: { type: String },
    idCategoria: { type: String, required: true },
    Origen: { type: String },
    Materiales: { type: String },
    Técnica: { type: String },
    Especificaciones: { type: String },
    Disponibilidad: { type: String, enum: ["En stock", "Agotado"], default: "En stock" },
    Comentarios: { type: String },
    idArtesano: { type: String, ref: "ContactoArtesano" }
}, { timestamps: true });

module.exports = mongoose.model("Producto", ProductoSchema, "productos");
