const Hospedaje = require('../models/hospedaje.model');

// GET todos los hospedajes
exports.obtenerHospedajes = async (req, res) => {
    try {
        const hospedajes = await Hospedaje.find();
        res.json(hospedajes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener hospedajes', error });
    }
};

// GET hospedaje por ID
exports.obtenerHospedajePorId = async (req, res) => {
    try {
        const hospedaje = await Hospedaje.findById(req.params.id);
        if (!hospedaje) return res.status(404).json({ mensaje: 'Hospedaje no encontrado' });
        res.json(hospedaje);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el hospedaje', error });
    }
};

// POST crear hospedaje
exports.crearHospedaje = async (req, res) => {
    try {
        const nuevoHospedaje = new Hospedaje(req.body);
        await nuevoHospedaje.save();
        res.status(201).json(nuevoHospedaje);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear hospedaje', error });
    }
};

// PUT actualizar hospedaje
exports.actualizarHospedaje = async (req, res) => {
    try {
        const hospedaje = await Hospedaje.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hospedaje) return res.status(404).json({ mensaje: 'Hospedaje no encontrado' });
        res.json(hospedaje);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar hospedaje', error });
    }
};

// DELETE eliminar hospedaje
exports.eliminarHospedaje = async (req, res) => {
    try {
        const hospedaje = await Hospedaje.findByIdAndDelete(req.params.id);
        if (!hospedaje) return res.status(404).json({ mensaje: 'Hospedaje no encontrado' });
        res.json({ mensaje: 'Hospedaje eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar hospedaje', error });
    }
};
