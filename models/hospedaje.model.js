const mongoose = require('mongoose');

const hospedajeSchema = new mongoose.Schema({
    idHotel: { type: String, required: true, unique: true },
    Nombre: { type: String, required: true },
    Imagenes: [String],
    Ubicacion: String,
    Horario: String,
    Telefono: String,
    Huespedes: String,
    Precio: Number,
    Servicios: String,
    Coordenadas: {
        lat: Number,
        lng: Number
    },
    Categoria: { type: String, default: 'Economico' },
    idHospedero: { type: String, required: true },
    estado: { type: String, enum: ["pendiente", "aceptado"], default: "aceptado" }
}, { timestamps: true });

module.exports = mongoose.model('Hospedaje', hospedajeSchema, 'hospedaje');
