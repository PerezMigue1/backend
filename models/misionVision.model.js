const mongoose = require('mongoose');

const misionVisionSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [100, 'El título no puede tener más de 100 caracteres']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true,
        maxlength: [1000, 'La descripción no puede tener más de 1000 caracteres']
    },
    tipo: {
        type: String,
        required: [true, 'El tipo es obligatorio'],
        enum: ['mision', 'vision'],
        default: 'mision'
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

// Índices para mejorar el rendimiento
misionVisionSchema.index({ tipo: 1, activo: 1 });
misionVisionSchema.index({ orden: 1 });

module.exports = mongoose.model('MisionVision', misionVisionSchema); 