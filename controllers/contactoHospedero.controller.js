const ContactoHospedero = require('../models/contactoHospedero.model');
const Usuario = require('../models/usuario.model');

// Crear nuevo contacto hospedero
exports.crearContactoHospedero = async (req, res) => {
    try {
        const datos = req.body;
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
        // Generar idHospedero automático
        const ultimo = await ContactoHospedero.findOne().sort({ createdAt: -1 }).lean();
        let nuevoId = "H0001";
        if (ultimo && ultimo.idHospedero) {
            const num = parseInt(ultimo.idHospedero.slice(1)) + 1;
            nuevoId = "H" + num.toString().padStart(4, "0");
        }
        datos.idHospedero = nuevoId;
        // Guardar contacto
        const nuevoContacto = new ContactoHospedero(datos);
        await nuevoContacto.save();
        // Actualizar roles del usuario
        const usuario = await Usuario.findOne({ _id: datos.idUsuario });
        if (usuario) {
            if (!usuario.roles) usuario.roles = [usuario.rol || 'turista'];
            if (!usuario.roles.includes('hospedero')) usuario.roles.push('hospedero');
            await usuario.save();
        }
        res.status(201).json({
            message: "Contacto hospedero creado correctamente",
            contacto: nuevoContacto
        });
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
