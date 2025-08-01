const mongoose = require('mongoose');

const encuestaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        maxlength: 200
    },
    descripcion: {
        type: String,
        required: true,
        maxlength: 1000
    },
    categoria: {
        type: String,
        required: true,
        enum: ['turismo', 'servicios', 'experiencia_usuario', 'satisfaccion', 'mejoras', 'general'],
        default: 'general'
    },
    preguntas: [{
        pregunta: {
            type: String,
            required: true,
            maxlength: 500
        },
        tipo: {
            type: String,
            required: true,
            enum: ['opcion_unica', 'opcion_multiple', 'texto_corto', 'texto_largo', 'escala_1_5', 'escala_1_10'],
            default: 'opcion_unica'
        },
        opciones: [{
            type: String,
            maxlength: 200
        }],
        requerida: {
            type: Boolean,
            default: true
        },
        orden: {
            type: Number,
            default: 0
        }
    }],
    fecha_inicio: {
        type: Date,
        required: true,
        default: Date.now
    },
    fecha_fin: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ['activa', 'inactiva', 'borrador'],
        default: 'borrador'
    },
    publica: {
        type: Boolean,
        default: true
    },
    permitir_anonimos: {
        type: Boolean,
        default: true
    },
    max_respuestas: {
        type: Number,
        default: 0 // 0 = sin límite
    },
    respuestas_actuales: {
        type: Number,
        default: 0
    },
    creado_por: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    tags: [{
        type: String,
        maxlength: 50
    }],
    imagen: {
        type: String,
        maxlength: 500
    },
    color_tema: {
        type: String,
        default: '#9A1E47'
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento
encuestaSchema.index({ estado: 1, fecha_fin: 1 });
encuestaSchema.index({ categoria: 1, estado: 1 });
encuestaSchema.index({ creado_por: 1 });

module.exports = mongoose.model('Encuesta', encuestaSchema, 'encuestas'); 