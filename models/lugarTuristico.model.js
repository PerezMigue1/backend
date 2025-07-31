const mongoose = require('mongoose');

const LugarTuristicoSchema = new mongoose.Schema({
    Nombre: { type: String, required: true },
    Imagen: [{ type: String }],
    Descripcion: { type: String },
    Horarios: { type: String },
    Costo: { type: String },
    NivelDeDificultad: { type: String },
    Categoria: { type: String,  required: true },
    LinkEducativos: [{ type: String }],
    Ubicacion: {
        Estado: { type: String },
        Municipio: { type: String },
        Coordenadas: {
            lat: { type: Number },
            lng: { type: Number }
        }
    }
});

module.exports = mongoose.model('LugarTuristico', LugarTuristicoSchema, 'lugarTuristico');