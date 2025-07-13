const ContactoArtesano = require("../models/contactoArtesano.model");

// Obtener todos los contactos
exports.obtenerContactos = async (req, res) => {
    try {
        const contactos = await ContactoArtesano.find();
        res.json(contactos);
    } catch (error) {
        console.error("❌ Error al obtener contactos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Obtener contacto por ID de Mongo
exports.obtenerContactoPorId = async (req, res) => {
    try {
        const contacto = await ContactoArtesano.findById(req.params.id);
        if (!contacto) {
            return res.status(404).json({ message: "Contacto no encontrado" });
        }
        res.json(contacto);
    } catch (error) {
        console.error("❌ Error al obtener contacto:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Crear nuevo contacto
exports.crearContacto = async (req, res) => {
    try {
        const nuevoContacto = new ContactoArtesano(req.body);
        await nuevoContacto.save();
        res.status(201).json({
            message: "Contacto creado correctamente",
            contacto: nuevoContacto
        });
    } catch (error) {
        console.error("❌ Error al crear contacto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar contacto
exports.actualizarContacto = async (req, res) => {
    try {
        const contactoActualizado = await ContactoArtesano.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!contactoActualizado) {
            return res.status(404).json({ message: "Contacto no encontrado" });
        }

        res.json({
            message: "Contacto actualizado correctamente",
            contacto: contactoActualizado
        });
    } catch (error) {
        console.error("❌ Error al actualizar contacto:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Eliminar contacto
exports.eliminarContacto = async (req, res) => {
    try {
        const contactoEliminado = await ContactoArtesano.findByIdAndDelete(req.params.id);

        if (!contactoEliminado) {
            return res.status(404).json({ message: "Contacto no encontrado" });
        }

        res.json({
            message: "Contacto eliminado correctamente",
            contacto: contactoEliminado
        });
    } catch (error) {
        console.error("❌ Error al eliminar contacto:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
