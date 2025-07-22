const mongoose = require('mongoose');

const publicacionGastronomiaSchema = new mongoose.Schema({
    idPlatillo: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    ingredientes: {
        type: [String],
        required: true
    },
    receta: {
        pasos: {
            type: [String],
            required: true
        },
        tiempoPreparacionMinutos: {
            type: String,
            required: true
        },
        tiempoCoccionHoras: {
            type: String,
            required: true
        },
        porciones: {
            type: String,
            required: true
        }
    },
    consejosServir: {
        type: [String],
        required: false
    },
    tipoPlatillo: {
        type: String,
        required: true
    },
    regionOrigen: {
        type: String,
        required: true
    },
    historiaOrigen: {
        type: String,
        required: false
    },
    ocasion: {
        type: [String],
        required: false
    },
    ubicacionDondeEncontrar: [{
        nombreLugar: {
            type: String,
            required: true
        },
        tipoLugar: {
            type: String,
            required: true
        },
        direccion: {
            type: String,
            required: true
        },
        coordenadas: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    }],
    imagen: {
        type: [String],
        required: true
    },
    idUsuario: {
        type: String,
        required: true
    },
    idChef: {
        type: String,
        required: true
    },

    // Estado de revisión
    estadoRevision: {
        type: String,
        enum: ['pendiente', 'aprobado', 'rechazado'],
        default: 'pendiente'
    },
    fechaSolicitud: {
        type: Date,
        default: Date.now
    },
    fechaRevision: {
        type: Date
    },
    revisadoPor: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PublicacionGastronomia', publicacionGastronomiaSchema, 'publicaciones-gastronomia');
