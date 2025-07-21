const mongoose = require('mongoose');

const contactoHospederoSchema = new mongoose.Schema({
    idUsuario: {
        type: String,
        required: true
    },
    idHospedero: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
    especialidad: {
        type: String,
        default: "Hospedaje"
    },
    redesSociales: {
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        whatsapp: { type: String, default: "" }
    },
    descripcion: {
        type: String,
        default: ""
    },
    imagenPerfil: {
        type: String,
        default: ""
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo'],
        default: 'activo'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ContactoHospedero', contactoHospederoSchema, 'contacto-hospedaje');
