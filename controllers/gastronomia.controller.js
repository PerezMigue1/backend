const Gastronomia = require('../models/gastronomia.model');

// GET todos los platillos/restaurantes
exports.obtenerGastronomia = async (req, res) => {
    try {
        const gastronomia = await Gastronomia.find();
        res.json(gastronomia);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener gastronomía', error });
    }
};

// GET gastronomía por ID
exports.obtenerGastronomiaPorId = async (req, res) => {
    try {
        const gastronomia = await Gastronomia.findById(req.params.id);
        if (!gastronomia) return res.status(404).json({ mensaje: 'Gastronomía no encontrada' });
        res.json(gastronomia);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la gastronomía', error });
    }
};

// POST crear gastronomía
exports.crearGastronomia = async (req, res) => {
    try {
        const nuevaGastronomia = new Gastronomia(req.body);
        await nuevaGastronomia.save();
        res.status(201).json(nuevaGastronomia);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear gastronomía', error });
    }
};

// PUT actualizar gastronomía
exports.actualizarGastronomia = async (req, res) => {
    try {
        const gastronomia = await Gastronomia.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!gastronomia) return res.status(404).json({ mensaje: 'Gastronomía no encontrada' });
        res.json(gastronomia);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar gastronomía', error });
    }
};

// DELETE eliminar gastronomía
exports.eliminarGastronomia = async (req, res) => {
    try {
        const gastronomia = await Gastronomia.findByIdAndDelete(req.params.id);
        if (!gastronomia) return res.status(404).json({ mensaje: 'Gastronomía no encontrada' });
        res.json({ mensaje: 'Gastronomía eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar gastronomía', error });
    }
};