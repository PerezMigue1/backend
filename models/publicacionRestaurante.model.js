const mongoose = require("mongoose");

const ReseñaSchema = new mongoose.Schema({
    Usuario: { type: String, required: true },
    Comentario: { type: String, required: true },
    Calificacion: { type: Number, min: 1, max: 5, required: true }
}, { _id: false });

const UbicacionSchema = new mongoose.Schema({
    Estado: { type: String },
    Municipio: { type: String },
    Coordenadas: {
        lat: { type: Number },
        lng: { type: Number }
    },
    Direccion: { type: String }
}, { _id: false });

const RedesSocialesSchema = new mongoose.Schema({
    Facebook: { type: String },
    Instagram: { type: String },
    WhatsApp: { type: String }
}, { _id: false });

const PublicacionRestauranteSchema = new mongoose.Schema({
    Nombre: { type: String, required: true },
    Categoria: { type: String, required: true },
    Descripcion: { type: String },
    Ubicacion: { type: UbicacionSchema },
    RedesSociales: { type: RedesSocialesSchema },
    Reseñas: [ReseñaSchema],
    Imagenes: [{ type: String }],
    Horario: { type: String },
    Contacto: { type: String },
    Recomendado: { type: Boolean, default: false },
    idUsuario: { type: String, required: true },
    idRestaurante: { type: String, required: true },
    estadoRevision: { type: String, enum: ["pendiente", "aprobado", "rechazado"], default: "pendiente" },
    motivoRechazo: { type: String },
    revisadoPor: { type: String },
    fechaSolicitud: { type: Date, default: Date.now },
    fechaRevision: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("PublicacionRestaurante", PublicacionRestauranteSchema, "publicaciones-restaurantes"); 