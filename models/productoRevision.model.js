// models/productoRevision.model.js
const mongoose = require("mongoose");

const ProductoRevisionSchema = new mongoose.Schema({
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
    idArtesano: { type: String, required: true }, // Añadir este campo
    
    // Datos de revisión
    idUsuario: { type: String, required: true },
    estadoRevision: { 
        type: String, 
        enum: ["pendiente", "aprobado", "rechazado"], 
        default: "pendiente" 
    },
    motivoRechazo: { type: String },
    revisadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }, // Referencia al administrador
    fechaSolicitud: { type: Date, default: Date.now },
    fechaRevision: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("ProductoRevision", ProductoRevisionSchema, "publicaciones");