const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    pregunta: {
        type: String,
        required: true,
        maxlength: 200
    },
    respuesta: {
        type: String,
        required: true,
        maxlength: 2000
    },
    categoria: {
        type: String,
        required: true,
        enum: ['general', 'servicios', 'tecnico', 'cuenta'],
        default: 'general'
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

module.exports = mongoose.model('FAQ', faqSchema, 'faq'); 