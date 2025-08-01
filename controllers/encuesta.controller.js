const Encuesta = require('../models/encuesta.model');
const RespuestaEncuesta = require('../models/respuestaEncuesta.model');

// ===== FUNCIONES PÚBLICAS =====

// ✅ Obtener encuestas públicas activas
exports.obtenerEncuestasPublicas = async (req, res) => {
    try {
        const encuestas = await Encuesta.find({
            estado: 'activa',
            publica: true,
            fecha_fin: { $gte: new Date() }
        })
        .select('titulo descripcion categoria fecha_inicio fecha_fin respuestas_actuales imagen color_tema tags')
        .sort({ fecha_inicio: -1 });

        res.json({
            success: true,
            data: encuestas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las encuestas',
            error: error.message
        });
    }
};

// ✅ Obtener encuesta por ID (pública)
exports.obtenerEncuestaPorId = async (req, res) => {
    try {
        const encuesta = await Encuesta.findById(req.params.id);
        
        if (!encuesta) {
            return res.status(404).json({
                success: false,
                message: 'Encuesta no encontrada'
            });
        }

        if (encuesta.estado !== 'activa' || !encuesta.publica) {
            return res.status(403).json({
                success: false,
                message: 'Encuesta no disponible'
            });
        }

        // Verificar si la fecha de fin ha pasado
        if (new Date() > encuesta.fecha_fin) {
            return res.status(403).json({
                success: false,
                message: 'Esta encuesta ya ha finalizado'
            });
        }

        res.json({
            success: true,
            data: encuesta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la encuesta',
            error: error.message
        });
    }
};

// ✅ Enviar respuesta a encuesta
exports.enviarRespuesta = async (req, res) => {
    try {
        const { encuesta_id, respuestas, tiempo_completado, comentarios_adicionales } = req.body;

        // Verificar que la encuesta existe y está activa
        const encuesta = await Encuesta.findById(encuesta_id);
        if (!encuesta || encuesta.estado !== 'activa') {
            return res.status(400).json({
                success: false,
                message: 'Encuesta no válida o inactiva'
            });
        }

        // Verificar límite de respuestas
        if (encuesta.max_respuestas > 0 && encuesta.respuestas_actuales >= encuesta.max_respuestas) {
            return res.status(400).json({
                success: false,
                message: 'Se ha alcanzado el límite máximo de respuestas para esta encuesta'
            });
        }

        // Verificar que todas las preguntas requeridas estén respondidas
        const preguntasRequeridas = encuesta.preguntas.filter(p => p.requerida);
        const preguntasRespondidas = respuestas.map(r => r.pregunta_id);

        for (let pregunta of preguntasRequeridas) {
            if (!preguntasRespondidas.includes(pregunta.orden)) {
                return res.status(400).json({
                    success: false,
                    message: `La pregunta "${pregunta.pregunta}" es obligatoria`
                });
            }
        }

        // Crear la respuesta
        const nuevaRespuesta = new RespuestaEncuesta({
            encuesta_id,
            usuario_id: req.user ? req.user.id : null,
            respuestas: respuestas.map(r => ({
                pregunta_id: r.pregunta_id,
                pregunta: r.pregunta,
                tipo: r.tipo,
                respuesta: r.respuesta,
                opciones_seleccionadas: r.opciones_seleccionadas || [],
                texto_respuesta: r.texto_respuesta || '',
                valor_numerico: r.valor_numerico || null
            })),
            tiempo_completado,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            comentarios_adicionales
        });

        await nuevaRespuesta.save();

        res.json({
            success: true,
            message: 'Respuesta enviada exitosamente',
            data: { respuesta_id: nuevaRespuesta._id }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al enviar la respuesta',
            error: error.message
        });
    }
};

// ===== FUNCIONES ADMINISTRATIVAS =====

// ✅ Obtener todas las encuestas (admin)
exports.obtenerTodasEncuestas = async (req, res) => {
    try {
        const encuestas = await Encuesta.find()
            .populate('creado_por', 'nombre email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: encuestas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las encuestas',
            error: error.message
        });
    }
};

// ✅ Crear nueva encuesta
exports.crearEncuesta = async (req, res) => {
    try {
        const nuevaEncuesta = new Encuesta({
            ...req.body,
            creado_por: req.user.id
        });

        await nuevaEncuesta.save();

        res.status(201).json({
            success: true,
            message: 'Encuesta creada exitosamente',
            data: nuevaEncuesta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la encuesta',
            error: error.message
        });
    }
};

// ✅ Actualizar encuesta
exports.actualizarEncuesta = async (req, res) => {
    try {
        const encuesta = await Encuesta.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!encuesta) {
            return res.status(404).json({
                success: false,
                message: 'Encuesta no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Encuesta actualizada exitosamente',
            data: encuesta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la encuesta',
            error: error.message
        });
    }
};

// ✅ Eliminar encuesta
exports.eliminarEncuesta = async (req, res) => {
    try {
        const encuesta = await Encuesta.findById(req.params.id);
        
        if (!encuesta) {
            return res.status(404).json({
                success: false,
                message: 'Encuesta no encontrada'
            });
        }

        // Eliminar respuestas asociadas
        await RespuestaEncuesta.deleteMany({ encuesta_id: req.params.id });
        
        // Eliminar la encuesta
        await Encuesta.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Encuesta eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la encuesta',
            error: error.message
        });
    }
};

// ✅ Obtener estadísticas de encuesta
exports.obtenerEstadisticasEncuesta = async (req, res) => {
    try {
        const encuestaId = req.params.id;
        
        // Obtener la encuesta
        const encuesta = await Encuesta.findById(encuestaId);
        if (!encuesta) {
            return res.status(404).json({
                success: false,
                message: 'Encuesta no encontrada'
            });
        }

        // Obtener todas las respuestas
        const respuestas = await RespuestaEncuesta.find({ encuesta_id: encuestaId });

        // Calcular estadísticas
        const estadisticas = {
            total_respuestas: respuestas.length,
            preguntas: []
        };

        // Procesar cada pregunta
        encuesta.preguntas.forEach((pregunta, index) => {
            const respuestasPregunta = respuestas.map(r => 
                r.respuestas.find(rp => rp.pregunta_id === pregunta.orden)
            ).filter(Boolean);

            let estadisticaPregunta = {
                pregunta: pregunta.pregunta,
                tipo: pregunta.tipo,
                total_respuestas: respuestasPregunta.length,
                opciones: {}
            };

            // Procesar según el tipo de pregunta
            switch (pregunta.tipo) {
                case 'opcion_unica':
                case 'opcion_multiple':
                    pregunta.opciones.forEach(opcion => {
                        const count = respuestasPregunta.filter(r => 
                            r.opciones_seleccionadas.includes(opcion)
                        ).length;
                        estadisticaPregunta.opciones[opcion] = {
                            count,
                            porcentaje: respuestasPregunta.length > 0 ? 
                                ((count / respuestasPregunta.length) * 100).toFixed(1) : 0
                        };
                    });
                    break;

                case 'escala_1_5':
                case 'escala_1_10':
                    const valores = respuestasPregunta.map(r => r.valor_numerico).filter(Boolean);
                    if (valores.length > 0) {
                        estadisticaPregunta.promedio = (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
                        estadisticaPregunta.min = Math.min(...valores);
                        estadisticaPregunta.max = Math.max(...valores);
                    }
                    break;

                case 'texto_corto':
                case 'texto_largo':
                    estadisticaPregunta.respuestas_texto = respuestasPregunta
                        .map(r => r.texto_respuesta)
                        .filter(Boolean);
                    break;
            }

            estadisticas.preguntas.push(estadisticaPregunta);
        });

        // Estadísticas generales
        estadisticas.tiempo_promedio = respuestas.length > 0 ? 
            (respuestas.reduce((sum, r) => sum + (r.tiempo_completado || 0), 0) / respuestas.length).toFixed(1) : 0;

        estadisticas.dispositivos = respuestas.reduce((acc, r) => {
            const tipo = r.dispositivo?.tipo || 'desktop';
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
        }, {});

        res.json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};

// ✅ Obtener respuestas de encuesta
exports.obtenerRespuestasEncuesta = async (req, res) => {
    try {
        const respuestas = await RespuestaEncuesta.find({ encuesta_id: req.params.id })
            .populate('usuario_id', 'nombre email')
            .sort({ fecha_respuesta: -1 });

        res.json({
            success: true,
            data: respuestas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las respuestas',
            error: error.message
        });
    }
}; 