const ContactoForm = require("../models/contactoForm.model");

// Obtener todos los formularios de contacto
exports.obtenerMensajes = async (req, res) => {
    try {
        const mensajes = await ContactoForm.find();
        res.json(mensajes);
    } catch (error) {
        console.error("❌ Error al obtener mensajes:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Crear nuevo formulario de contacto
exports.crearMensaje = async (req, res) => {
    try {
        const nuevoMensaje = new ContactoForm(req.body);
        await nuevoMensaje.save();
        res.status(201).json({
            message: "Mensaje enviado correctamente",
            mensaje: nuevoMensaje
        });
    } catch (error) {
        console.error("❌ Error al enviar mensaje:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener un mensaje por ID (opcional)
exports.obtenerMensajePorId = async (req, res) => {
    try {
        const mensaje = await ContactoForm.findById(req.params.id);
        if (!mensaje) {
            return res.status(404).json({ message: "Mensaje no encontrado" });
        }
        res.json(mensaje);
    } catch (error) {
        console.error("❌ Error al buscar mensaje:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar un mensaje (opcional)
exports.eliminarMensaje = async (req, res) => {
    try {
        const eliminado = await ContactoForm.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ message: "Mensaje no encontrado" });
        }
        res.json({
            message: "Mensaje eliminado correctamente",
            mensaje: eliminado
        });
    } catch (error) {
        console.error("❌ Error al eliminar mensaje:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
