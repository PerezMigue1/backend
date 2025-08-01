const mongoose = require('mongoose');

const respuestaEncuestaSchema = new mongoose.Schema({
    encuesta_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Encuesta',
        required: true
    },
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
        // Opcional para respuestas anónimas
    },
    respuestas: [{
        pregunta_id: {
            type: Number,
            required: true
        },
        pregunta: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            required: true
        },
        respuesta: {
            type: mongoose.Schema.Types.Mixed,
            required: true
            // Puede ser string, array, number según el tipo de pregunta
        },
        opciones_seleccionadas: [{
            type: String
        }],
        texto_respuesta: {
            type: String
        },
        valor_numerico: {
            type: Number
        }
    }],
    fecha_respuesta: {
        type: Date,
        default: Date.now
    },
    tiempo_completado: {
        type: Number // en segundos
    },
    ip_address: {
        type: String,
        maxlength: 45
    },
    user_agent: {
        type: String,
        maxlength: 500
    },
    dispositivo: {
        tipo: {
            type: String,
            enum: ['desktop', 'mobile', 'tablet'],
            default: 'desktop'
        },
        navegador: String,
        sistema_operativo: String
    },
    ubicacion: {
        pais: String,
        region: String,
        ciudad: String
    },
    completada: {
        type: Boolean,
        default: true
    },
    calificacion_satisfaccion: {
        type: Number,
        min: 1,
        max: 5
    },
    comentarios_adicionales: {
        type: String,
        maxlength: 1000
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento
respuestaEncuestaSchema.index({ encuesta_id: 1, fecha_respuesta: -1 });
respuestaEncuestaSchema.index({ usuario_id: 1 });
respuestaEncuestaSchema.index({ fecha_respuesta: -1 });

// Middleware para actualizar el contador de respuestas en la encuesta
respuestaEncuestaSchema.post('save', async function(doc) {
    try {
        const Encuesta = mongoose.model('Encuesta');
        await Encuesta.findByIdAndUpdate(
            doc.encuesta_id,
            { $inc: { respuestas_actuales: 1 } }
        );
    } catch (error) {
        console.error('Error actualizando contador de respuestas:', error);
    }
});

module.exports = mongoose.model('RespuestaEncuesta', respuestaEncuestaSchema, 'respuestas_encuestas'); 