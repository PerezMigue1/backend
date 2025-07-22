const mongoose = require('mongoose');

const contactoChefSchema = new mongoose.Schema({
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
        default: "Gastronomia"
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
    },
    roles: { type: [String], default: ["chef"] }
}, {
    timestamps: true
});

module.exports = mongoose.model('ContactoChef', contactoChefSchema, 'contacto-chef');