const ContactoRestaurante = require("../models/contactoRestaurante.model");

// Obtener todos los contactos
exports.obtenerContactos = async (req, res) => {
    try {
        const contactos = await ContactoRestaurante.find();
        res.json(contactos);
    } catch (error) {
        console.error("❌ Error al obtener contactos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Obtener contacto por ID de Mongo
exports.obtenerContactoPorId = async (req, res) => {
    try {
        const contacto = await ContactoRestaurante.findOne({ idRestaurante: req.params.id });

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
        console.log("📸 Archivo recibido:", req.file);

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

        // Generar idRestaurante automático
        const ultimo = await ContactoRestaurante.findOne().sort({ createdAt: -1 }).lean();
        let nuevoId = "RST001";
        if (ultimo && ultimo.idRestaurante) {
            const num = parseInt(ultimo.idRestaurante.replace(/[^0-9]/g, '')) + 1;
            nuevoId = "RST" + num.toString().padStart(3, "0");
        }
        datos.idRestaurante = nuevoId;

        const nuevoContacto = new ContactoRestaurante(datos);
        await nuevoContacto.save();

        res.status(201).json({
            message: "Contacto creado correctamente",
            contacto: nuevoContacto
        });
    } catch (error) {
        console.error("❌ Error al crear contacto:", error.message);
        console.error("Datos recibidos:", datos.message);
        console.error(error.stack);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

// Actualizar contacto
exports.actualizarContacto = async (req, res) => {
    try {
        const contactoActualizado = await ContactoRestaurante.findByIdAndUpdate(
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
        const contactoEliminado = await ContactoRestaurante.findByIdAndDelete(req.params.id);

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

// Obtener restaurante por idUsuario
exports.obtenerRestaurantePorUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const restaurante = await ContactoRestaurante.findOne({ idUsuario });

        if (!restaurante) {
            return res.status(404).json({ message: "No se encontró restaurante para este usuario." });
        }

        res.json(restaurante);
    } catch (error) {
        console.error("❌ Error al obtener restaurante por idUsuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}; 