const mongoose = require('mongoose');

const gastronomiaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    imagen: {
        url: { type: String, required: true }
    },
    descripcion: { type: String, required: true },
    ingredientes: { type: [String], required: true },
    receta: {
        pasos: { type: [String], required: true },
        tiempoPreparacionMinutos: { type: Number, required: true },
        tiempoCoccionHoras: { type: Number, required: true },
        porciones: { type: Number, required: true }
    },
    consejosServir: { type: [String], required: false },
    tipoPlatillo: { type: String, required: true },
    regionOrigen: { type: String, required: true },
    historiaOrigen: { type: String, required: true },
    ocasion: { type: [String], required: true },
    ubicacionDondeEncontrar: [{
        nombreLugar: { type: String, required: true },
        tipoLugar: { type: String, required: true },
        direccion: { type: String, required: true },
        coordenadas: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    }],
    idChef: { type: String },
    estado: { type: String, enum: ["pendiente", "aceptado"], default: "aceptado" }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Gastronomia', gastronomiaSchema, 'gastronomia');