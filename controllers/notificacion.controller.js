const Notificacion = require('../models/notificacion.model');

// Obtener todas las notificaciones
exports.obtenerTodas = async (req, res) => {
    try {
        const notificaciones = await Notificacion.find().sort({ fecha: -1 });
        res.json(notificaciones);
    } catch (error) {
        console.error("❌ Error al obtener notificaciones:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Obtener notificaciones por ID de usuario
exports.obtenerPorUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        console.log("🔍 Buscando notificaciones para usuario:", idUsuario);
        
        const notificaciones = await Notificacion.find({ idUsuario }).sort({ fecha: -1 });
        console.log("📋 Notificaciones encontradas:", notificaciones.length);
        
        res.json(notificaciones);
    } catch (error) {
        console.error("❌ Error al obtener notificaciones por usuario:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Crear nueva notificación
exports.crear = async (req, res) => {
    try {
        console.log("📝 Creando notificación:", req.body);
        
        const nueva = new Notificacion(req.body);
        await nueva.save();
        
        console.log("✅ Notificación creada:", nueva._id);
        res.status(201).json({ message: 'Notificación creada correctamente', notificacion: nueva });
    } catch (error) {
        console.error("❌ Error al crear notificación:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Eliminar notificación por ID
exports.eliminar = async (req, res) => {
    try {
        const eliminada = await Notificacion.findByIdAndDelete(req.params.id);
        if (!eliminada) {
            return res.status(404).json({ message: "Notificación no encontrada" });
        }
        res.json({ message: "Notificación eliminada", notificacion: eliminada });
    } catch (error) {
        console.error("❌ Error al eliminar notificación:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Marcar notificación como leída
exports.marcarComoLeida = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizada = await Notificacion.findByIdAndUpdate(
            id,
            { estado: 'leido' },
            { new: true }
        );
        
        if (!actualizada) {
            return res.status(404).json({ message: "Notificación no encontrada" });
        }
        
        res.json({ message: "Notificación marcada como leída", notificacion: actualizada });
    } catch (error) {
        console.error("❌ Error al marcar notificación como leída:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Obtener notificaciones no leídas por usuario
exports.obtenerNoLeidas = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const notificaciones = await Notificacion.find({ 
            idUsuario, 
            estado: { $ne: 'leido' } 
        }).sort({ fecha: -1 });
        
        res.json(notificaciones);
    } catch (error) {
        console.error("❌ Error al obtener notificaciones no leídas:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};
