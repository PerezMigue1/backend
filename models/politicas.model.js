const mongoose = require('mongoose');

const politicasSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        maxlength: 100
    },
    descripcion: {
        type: String,
        required: true,
        maxlength: 2000
    },
    tipo: {
        type: String,
        required: true,
        enum: ['privacidad', 'terminos', 'cookies', 'uso'],
        default: 'privacidad'
    },
    activo: {
        type: Boolean,
        default: true
    },
    orden: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Politicas', politicasSchema, 'politicas'); 