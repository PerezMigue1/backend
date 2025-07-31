const Politicas = require('../models/politicas.model');

// Obtener políticas públicas (activas)
const obtenerPoliticasPublicas = async (req, res) => {
    try {
        const politicas = await Politicas.find({ activo: true })
            .sort({ orden: 1, createdAt: -1 });

        res.json({
            success: true,
            data: politicas
        });
    } catch (error) {
        console.error('Error al obtener políticas públicas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener política por tipo (público)
const obtenerPoliticaPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        
        const politica = await Politicas.findOne({ 
            tipo: tipo, 
            activo: true 
        }).sort({ orden: 1, createdAt: -1 });

        if (!politica) {
            return res.status(404).json({
                success: false,
                message: 'Política no encontrada'
            });
        }

        res.json({
            success: true,
            data: politica
        });
    } catch (error) {
        console.error('Error al obtener política por tipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener todas las políticas (admin)
const obtenerTodasPoliticas = async (req, res) => {
    try {
        const politicas = await Politicas.find()
            .sort({ orden: 1, createdAt: -1 });

        res.json({
            success: true,
            data: politicas
        });
    } catch (error) {
        console.error('Error al obtener todas las políticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Crear nueva política (admin)
const crearPolitica = async (req, res) => {
    try {
        const { titulo, descripcion, tipo, activo, orden } = req.body;

        // Validar que no exista otra política activa del mismo tipo
        if (activo) {
            const politicaExistente = await Politicas.findOne({ 
                tipo: tipo, 
                activo: true 
            });
            
            if (politicaExistente) {
                return res.status(400).json({
                    success: false,
                    message: `Ya existe una política activa de tipo "${tipo}". Solo puede haber una política activa por tipo.`
                });
            }
        }

        const nuevaPolitica = new Politicas({
            titulo,
            descripcion,
            tipo,
            activo: activo !== undefined ? activo : true,
            orden: orden || 0
        });

        const politicaGuardada = await nuevaPolitica.save();

        res.status(201).json({
            success: true,
            data: politicaGuardada,
            message: 'Política creada exitosamente'
        });
    } catch (error) {
        console.error('Error al crear política:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar política (admin)
const actualizarPolitica = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, tipo, activo, orden } = req.body;

        const politica = await Politicas.findById(id);
        if (!politica) {
            return res.status(404).json({
                success: false,
                message: 'Política no encontrada'
            });
        }

        // Si se está activando y cambiando el tipo, verificar que no exista otra activa del nuevo tipo
        if (activo && tipo && tipo !== politica.tipo) {
            const politicaExistente = await Politicas.findOne({ 
                tipo: tipo, 
                activo: true,
                _id: { $ne: id } // Excluir la política actual
            });
            
            if (politicaExistente) {
                return res.status(400).json({
                    success: false,
                    message: `Ya existe una política activa de tipo "${tipo}". Solo puede haber una política activa por tipo.`
                });
            }
        }

        // Actualizar campos
        if (titulo !== undefined) politica.titulo = titulo;
        if (descripcion !== undefined) politica.descripcion = descripcion;
        if (tipo !== undefined) politica.tipo = tipo;
        if (activo !== undefined) politica.activo = activo;
        if (orden !== undefined) politica.orden = orden;

        const politicaActualizada = await politica.save();

        res.json({
            success: true,
            data: politicaActualizada,
            message: 'Política actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar política:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar política (admin) - Soft delete
const eliminarPolitica = async (req, res) => {
    try {
        const { id } = req.params;

        const politica = await Politicas.findById(id);
        if (!politica) {
            return res.status(404).json({
                success: false,
                message: 'Política no encontrada'
            });
        }

        // Soft delete - marcar como inactiva
        politica.activo = false;
        await politica.save();

        res.json({
            success: true,
            message: 'Política eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar política:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    obtenerPoliticasPublicas,
    obtenerPoliticaPorTipo,
    obtenerTodasPoliticas,
    crearPolitica,
    actualizarPolitica,
    eliminarPolitica
}; 