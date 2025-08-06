const mongoose = require('mongoose');

const ReseñaSchema = new mongoose.Schema({
  Usuario: { type: String, required: true },
  Comentario: { type: String, required: true },
  Calificacion: { type: Number, required: true }
}, { _id: false });

const RestauranteSchema = new mongoose.Schema({
  Nombre: { type: String, required: true },
  Categoria: { type: String, required: true },
  Descripcion: { type: String, required: true },
  Ubicacion: {
    Estado: { type: String, required: true },
    Municipio: { type: String, required: true },
    Coordenadas: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    Direccion: { type: String, required: true }
  },
  RedesSociales: {
    Facebook: { type: String },
    Instagram: { type: String },
    WhatsApp: { type: String }
  },
  Reseñas: [ReseñaSchema],
  Imagenes: [{ type: String }],
  Horario: { type: String },
  Contacto: { type: String },
  Recomendado: { type: Boolean, default: false },
  idRestaurante: { type: String, required: true, unique: true },
  estado: { type: String, enum: ["pendiente", "aceptado"], default: "aceptado" }
}, { timestamps: true });

module.exports = mongoose.model('Restaurante', RestauranteSchema, 'restaurantes'); 