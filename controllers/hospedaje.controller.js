const Hospedaje = require('../models/hospedaje.model');

exports.crearHospedaje = async (req, res) => {
    try {
        const nuevo = new Hospedaje(req.body);
        const guardado = await nuevo.save();
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear hospedaje', error });
    }
};

exports.obtenerHospedajes = async (req, res) => {
    try {
        const lista = await Hospedaje.find();
        res.json(lista);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener hospedajes', error });
    }
};

exports.obtenerHospedajePorId = async (req, res) => {
    try {
        const hospedaje = await Hospedaje.findById(req.params.id);
        if (!hospedaje) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json(hospedaje);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar hospedaje', error });
    }
};

exports.actualizarHospedaje = async (req, res) => {
    try {
        const actualizado = await Hospedaje.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar hospedaje', error });
    }
};

exports.eliminarHospedaje = async (req, res) => {
    try {
        const eliminado = await Hospedaje.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json({ mensaje: 'Hospedaje eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar hospedaje', error });
    }
};
