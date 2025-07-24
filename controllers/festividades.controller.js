const Festividad = require('../models/festividades.model');

// Crear festividad
exports.crearFestividad = async (req, res) => {
    try {
        const nueva = new Festividad(req.body);
        const guardada = await nueva.save();
        res.status(201).json(guardada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear festividad', error });
    }
};

// Obtener todas las festividades
exports.obtenerFestividades = async (req, res) => {
    try {
        const lista = await Festividad.find();
        res.json(lista);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener festividades', error });
    }
};

// Obtener festividad por ID
exports.obtenerFestividadPorId = async (req, res) => {
    try {
        const festividad = await Festividad.findById(req.params.id);
        if (!festividad) return res.status(404).json({ mensaje: 'No encontrada' });
        res.json(festividad);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar festividad', error });
    }
};

// Actualizar festividad
exports.actualizarFestividad = async (req, res) => {
    try {
        const actualizada = await Festividad.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizada) return res.status(404).json({ mensaje: 'No encontrada' });
        res.json(actualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar festividad', error });
    }
};

// Eliminar festividad
exports.eliminarFestividad = async (req, res) => {
    try {
        const eliminada = await Festividad.findByIdAndDelete(req.params.id);
        if (!eliminada) return res.status(404).json({ mensaje: 'No encontrada' });
        res.json({ mensaje: 'Festividad eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar festividad', error });
    }
};