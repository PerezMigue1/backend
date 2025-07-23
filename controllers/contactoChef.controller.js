const ContactoChef = require('../models/contactoChef.model');
const Usuario = require('../models/usuario.model');

// Crear nuevo contacto chef
exports.crearContactoChef = async (req, res) => {
    try {
        const datos = req.body;
        console.log("📥 BODY recibido:", datos);
        // Validar campos obligatorios
        const camposObligatorios = ['idUsuario', 'nombre', 'correo', 'telefono'];
        for (const campo of camposObligatorios) {
            if (!datos[campo] || datos[campo] === '') {
                return res.status(400).json({ mensaje: `El campo '${campo}' es obligatorio.` });
            }
        }
        // Manejar redes sociales desde FormData
        datos.redesSociales = {
            facebook: datos['redesSociales.facebook'] || '',
            instagram: datos['redesSociales.instagram'] || '',
            whatsapp: datos['redesSociales.whatsapp'] || '',
        };
        // Imagen si existe
        if (req.file) {
            datos.imagenPerfil = req.file.path || req.file?.path;
        }
        // Generar idChef automático
        const ultimo = await ContactoChef.findOne().sort({ createdAt: -1 }).lean();
        let nuevoId = "C0001";
        if (ultimo && ultimo.idChef) {
            const num = parseInt(ultimo.idChef.slice(1)) + 1;
            nuevoId = "C" + num.toString().padStart(4, "0");
        }
        datos.idChef = nuevoId;
        // Guardar contacto
        const nuevoContacto = new ContactoChef(datos);
        await nuevoContacto.save();
        // Actualizar roles del usuario
        const usuario = await Usuario.findOne({ _id: datos.idUsuario });
        if (usuario) {
            if (!Array.isArray(usuario.rol)) usuario.rol = [usuario.rol || 'turista'];
            if (!usuario.rol.includes('chef')) usuario.rol.push('chef');
            await usuario.save();
        }
        console.log("✅ Chef registrado correctamente:", nuevoContacto.idChef);
        res.status(201).json({
            message: "Contacto chef creado correctamente",
            contacto: nuevoContacto
        });
    } catch (error) {
        console.error("❌ Error al crear chef:", error.message);
        res.status(400).json({ mensaje: "Error al crear contacto", error });
    }
};

// Obtener todos los contactos
exports.obtenerContactos = async (req, res) => {
    try {
        const contactos = await ContactoChef.find();
        res.json(contactos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener contactos", error });
    }
};

// Obtener contacto por ID
exports.obtenerContactoPorId = async (req, res) => {
    try {
        const contacto = await ContactoChef.findById(req.params.id);
        if (!contacto) return res.status(404).json({ mensaje: "Contacto no encontrado" });
        res.json(contacto);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar contacto", error });
    }
};

// Actualizar contacto
exports.actualizarContacto = async (req, res) => {
    try {
        const actualizado = await ContactoChef.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) return res.status(404).json({ mensaje: "Contacto no encontrado" });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar contacto", error });
    }
};

// Eliminar contacto
exports.eliminarContacto = async (req, res) => {
    try {
        const eliminado = await ContactoChef.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: "Contacto no encontrado" });
        res.json({ mensaje: "Contacto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar contacto", error });
    }
};

// Obtener chef por idUsuario
exports.obtenerChefPorUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const chef = await ContactoChef.findOne({ idUsuario });

        if (!chef) {
            return res.status(404).json({ message: "No se encontró chef para este usuario." });
        }

        res.json(chef);
    } catch (error) {
        console.error("❌ Error al obtener chef por idUsuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
