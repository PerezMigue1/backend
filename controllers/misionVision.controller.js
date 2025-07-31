const MisionVision = require('../models/misionVision.model');

// Obtener todas las misiones y visiones
const obtenerMisionVision = async (req, res) => {
    try {
        const misionVision = await MisionVision.find({ activo: true })
            .sort({ orden: 1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: misionVision
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener misión y visión',
            error: error.message
        });
    }
};

// Obtener solo misión
const obtenerMision = async (req, res) => {
    try {
        const mision = await MisionVision.findOne({ 
            tipo: 'mision', 
            activo: true 
        }).sort({ orden: 1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: mision
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener misión',
            error: error.message
        });
    }
};

// Obtener solo visión
const obtenerVision = async (req, res) => {
    try {
        const vision = await MisionVision.findOne({ 
            tipo: 'vision', 
            activo: true 
        }).sort({ orden: 1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: vision
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener visión',
            error: error.message
        });
    }
};

// Crear nueva misión o visión
const crearMisionVision = async (req, res) => {
    try {
        const { titulo, descripcion, tipo, orden } = req.body;

        // Verificar si ya existe una misión/visión activa del mismo tipo
        const existente = await MisionVision.findOne({ 
            tipo, 
            activo: true 
        });

        if (existente) {
            return res.status(400).json({
                success: false,
                message: `Ya existe una ${tipo} activa. Desactiva la anterior antes de crear una nueva.`
            });
        }

        const nuevaMisionVision = new MisionVision({
            titulo,
            descripcion,
            tipo,
            orden: orden || 0
        });

        const guardado = await nuevaMisionVision.save();

        res.status(201).json({
            success: true,
            message: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} creada exitosamente`,
            data: guardado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear misión/visión',
            error: error.message
        });
    }
};

// Actualizar misión o visión
const actualizarMisionVision = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, tipo, activo, orden } = req.body;

        const misionVision = await MisionVision.findById(id);
        
        if (!misionVision) {
            return res.status(404).json({
                success: false,
                message: 'Misión/visión no encontrada'
            });
        }

        // Si se está activando, verificar que no haya otra del mismo tipo activa
        if (activo && !misionVision.activo) {
            const existente = await MisionVision.findOne({ 
                tipo: misionVision.tipo, 
                activo: true,
                _id: { $ne: id }
            });

            if (existente) {
                return res.status(400).json({
                    success: false,
                    message: `Ya existe una ${misionVision.tipo} activa. Desactiva la anterior antes de activar esta.`
                });
            }
        }

        const actualizado = await MisionVision.findByIdAndUpdate(
            id,
            { titulo, descripcion, tipo, activo, orden },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Misión/visión actualizada exitosamente',
            data: actualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar misión/visión',
            error: error.message
        });
    }
};

// Eliminar misión o visión (soft delete)
const eliminarMisionVision = async (req, res) => {
    try {
        const { id } = req.params;

        const misionVision = await MisionVision.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true }
        );

        if (!misionVision) {
            return res.status(404).json({
                success: false,
                message: 'Misión/visión no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Misión/visión eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar misión/visión',
            error: error.message
        });
    }
};

// Obtener misión/visión por ID (para admin)
const obtenerMisionVisionPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const misionVision = await MisionVision.findById(id);
        
        if (!misionVision) {
            return res.status(404).json({
                success: false,
                message: 'Misión/visión no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: misionVision
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener misión/visión',
            error: error.message
        });
    }
};

// Obtener todas las misiones y visiones (incluyendo inactivas para admin)
const obtenerTodasMisionVision = async (req, res) => {
    try {
        const misionVision = await MisionVision.find()
            .sort({ orden: 1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: misionVision
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener misión y visión',
            error: error.message
        });
    }
};

module.exports = {
    obtenerMisionVision,
    obtenerMision,
    obtenerVision,
    crearMisionVision,
    actualizarMisionVision,
    eliminarMisionVision,
    obtenerMisionVisionPorId,
    obtenerTodasMisionVision
}; 