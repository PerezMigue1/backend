const mongoose = require('mongoose');

const ecoturismoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        maxlength: 200
    },
    descripcion: {
        type: String,
        required: true,
        maxlength: 2000
    },
    ubicacion: {
        type: String,
        required: true,
        maxlength: 300
    },
    coordenadas: {
        latitud: {
            type: Number,
            required: true
        },
        longitud: {
            type: Number,
            required: true
        }
    },
    categoria: {
        type: String,
        required: true,
        enum: ['senderismo', 'cascadas', 'observacion_aves', 'camping', 'espeleologia', 'rafting', 'ciclismo', 'fotografia'],
        default: 'senderismo'
    },
    dificultad: {
        type: String,
        required: true,
        enum: ['facil', 'moderado', 'dificil', 'experto'],
        default: 'moderado'
    },
    duracion: {
        type: String,
        required: true,
        maxlength: 100
    },
    distancia: {
        type: String,
        required: true,
        maxlength: 100
    },
    altitud: {
        type: String,
        maxlength: 100
    },
    clima: {
        type: String,
        maxlength: 200
    },
    mejor_epoca: {
        type: String,
        maxlength: 200
    },
    equipamiento: [{
        type: String,
        maxlength: 100
    }],
    servicios_disponibles: [{
        type: String,
        maxlength: 100
    }],
    flora: {
        type: String,
        maxlength: 500
    },
    fauna: {
        type: String,
        maxlength: 500
    },
    imagenes: [{
        type: String,
        maxlength: 500
    }],
    precio_entrada: {
        type: Number,
        default: 0
    },
    horarios: {
        apertura: {
            type: String,
            maxlength: 50
        },
        cierre: {
            type: String,
            maxlength: 50
        }
    },
    contacto: {
        telefono: {
            type: String,
            maxlength: 20
        },
        email: {
            type: String,
            maxlength: 100
        },
        sitio_web: {
            type: String,
            maxlength: 200
        }
    },
    restricciones: {
        type: String,
        maxlength: 500
    },
    recomendaciones: {
        type: String,
        maxlength: 500
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo', 'mantenimiento'],
        default: 'activo'
    },
    destacado: {
        type: Boolean,
        default: false
    },
    calificacion: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    visitas: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento de las consultas
ecoturismoSchema.index({ categoria: 1, estado: 1 });
ecoturismoSchema.index({ destacado: 1, estado: 1 });
ecoturismoSchema.index({ 'coordenadas.latitud': 1, 'coordenadas.longitud': 1 });

module.exports = mongoose.model('Ecoturismo', ecoturismoSchema, 'ecoturismo'); 