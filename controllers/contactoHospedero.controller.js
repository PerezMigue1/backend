const ContactoHospedero = require('../models/contactoHospedero.model');

// Crear nuevo contacto hospedero
exports.crearContactoHospedero = async (req, res) => {
    try {
        const nuevoContacto = new ContactoHospedero(req.body);
        const guardado = await nuevoContacto.save();
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear contacto", error });
    }
};

// Obtener todos los contactos
exports.obtenerContactos = async (req, res) => {
    try {
        const contactos = await ContactoHospedero.find();
        res.json(contactos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener contactos", error });
    }
};

// Obtener contacto por ID
exports.obtenerContactoPorId = async (req, res) => {
    try {
        const contacto = await ContactoHospedero.findById(req.params.id);
        if (!contacto) return res.status(404).json({ mensaje: "Contacto no encontrado" });
        res.json(contacto);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar contacto", error });
    }
};

// Actualizar contacto
exports.actualizarContacto = async (req, res) => {
    try {
        const actualizado = await ContactoHospedero.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) return res.status(404).json({ mensaje: "Contacto no encontrado" });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar contacto", error });
    }
};

// Eliminar contacto
exports.eliminarContacto = async (req, res) => {
    try {
        const eliminado = await ContactoHospedero.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: "Contacto no encontrado" });
        res.json({ mensaje: "Contacto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar contacto", error });
    }
};
