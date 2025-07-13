const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
    idProducto: { type: String, required: true, unique: true },
    Nombre: { type: String, required: true },
    Imagen: [{ type: String, required: true }],
    Precio: { type: Number, required: true },
    Descripción: { type: String },
    Forma: { type: String },
    "Largo x Ancho": { type: String },
    Etiquetas: { type: String },
    idCategoria: { type: String, required: true },
    Origen: { type: String },
    Materiales: { type: String },
    Disponibilidad: { type: String, enum: ["En stock", "Agotado"], default: "En stock" },
    "Tiempo-estimado-llegada": { type: Date },
    Comentarios: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Producto", ProductoSchema, "productos");
