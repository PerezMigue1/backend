const Publicacion = require('../models/publicacionHospedaje.model');

// Crear nueva publicación
exports.crearPublicacion = async (req, res) => {
    try {
        const nueva = new Publicacion(req.body);
        const guardada = await nueva.save();
        res.status(201).json(guardada);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear publicación", error });
    }
};

// Obtener todas las publicaciones
exports.obtenerPublicaciones = async (req, res) => {
    try {
        const publicaciones = await Publicacion.find();
        res.json(publicaciones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener publicaciones", error });
    }
};

// Obtener publicación por ID
exports.obtenerPublicacionPorId = async (req, res) => {
    try {
        const publicacion = await Publicacion.findById(req.params.id);
        if (!publicacion) return res.status(404).json({ mensaje: "Publicación no encontrada" });
        res.json(publicacion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar publicación", error });
    }
};

// Actualizar publicación
exports.actualizarPublicacion = async (req, res) => {
    try {
        const actualizada = await Publicacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizada) return res.status(404).json({ mensaje: "Publicación no encontrada" });
        res.json(actualizada);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar publicación", error });
    }
};

// Eliminar publicación
exports.eliminarPublicacion = async (req, res) => {
    try {
        const eliminada = await Publicacion.findByIdAndDelete(req.params.id);
        if (!eliminada) return res.status(404).json({ mensaje: "Publicación no encontrada" });
        res.json({ mensaje: "Publicación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar publicación", error });
    }
};
