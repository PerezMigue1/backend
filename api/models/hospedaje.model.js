const mongoose = require('mongoose');

const hospedajeSchema = new mongoose.Schema({
    idHotel: { type: String, required: true, unique: true },
    Nombre: { type: String, required: true },
    Imagenes: { type: [String], required: true },
    Ubicacion: { type: String, required: true },
    Horario: { type: String, required: true },
    Telefono: { type: String, required: true },
    Huespedes: { type: String, required: true },
    Precio: { type: Number, required: true },
    Servicios: { type: String, required: true },
    Coordenadas: { type: String, required: true },
    Categoria: { type: String, required: true }
});

module.exports = mongoose.model('Hospedaje', hospedajeSchema, 'hospedaje');
