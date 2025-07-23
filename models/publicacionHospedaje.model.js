const mongoose = require('mongoose');

const publicacionHospedajeSchema = new mongoose.Schema({
    idHotel: {
        type: String,
        required: true,
        unique: true
    },
    Nombre: {
        type: String,
        required: true
    },
    Imagenes: {
        type: [String],
        required: true
    },
    Ubicacion: {
        type: String,
        required: true
    },
    Horario: {
        type: String,
        required: true
    },
    Telefono: {
        type: String,
        required: true
    },
    Huespedes: {
        type: String,
        required: true
    },
    Precio: {
        type: Number,
        required: true
    },
    Servicios: {
        type: String,
        required: true
    },
    Coordenadas: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    Categoria: {
        type: String,
        enum: ['Economico', 'Estandar', 'Premium'],
        default: 'Economico'
    },
    idUsuario: {
        type: String,
        required: true
    },
    idHospedero: {
        type: String,
        required: true
    },

    //datos de revison no sirve
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

module.exports = mongoose.model('PublicacionHospedaje', publicacionHospedajeSchema, 'publicaciones-hospedaje');