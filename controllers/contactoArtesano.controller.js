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
        const contacto = await ContactoArtesano.findOne({ idArtesano: req.params.id });

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
        const datos = req.body;

        // Convertir redes sociales desde FormData
        datos.redesSociales = {
            facebook: datos['redesSociales.facebook'] || '',
            instagram: datos['redesSociales.instagram'] || '',
            whatsapp: datos['redesSociales.whatsapp'] || '',
        };

        // Imagen si existe
        if (req.file) {
            datos.imagenPerfil = req.file.path || req.file?.path;
        }

        // Generar idArtesano automático
        const ultimo = await ContactoArtesano.findOne().sort({ createdAt: -1 }).lean();
        let nuevoId = "A0001";
        if (ultimo && ultimo.idArtesano) {
            const num = parseInt(ultimo.idArtesano.slice(1)) + 1;
            nuevoId = "A" + num.toString().padStart(4, "0");
        }
        datos.idArtesano = nuevoId;

        const nuevoContacto = new ContactoArtesano(datos);
        await nuevoContacto.save();

        res.status(201).json({
            message: "Contacto creado correctamente",
            contacto: nuevoContacto
        });
    } catch (error) {
        console.error("❌ Error al crear contacto:", error.message);
        console.error(error.stack);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
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

