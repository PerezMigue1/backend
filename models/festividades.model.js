const mongoose = require('mongoose');

const fuenteSchema = new mongoose.Schema({
    titulo: String,
    url: String
}, { _id: false });

const fechaSchema = new mongoose.Schema({
    inicio: String,
    fin: String
}, { _id: false });

const festividadSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: String,
    fecha: fechaSchema,
    municipios: [String],
    tipo: String,
    origen: String,
    actividades: [String],
    elementosCulturales: [String],
    importancia: String,
    fuentes: [fuenteSchema]
});

module.exports = mongoose.model('Festividad', festividadSchema);
