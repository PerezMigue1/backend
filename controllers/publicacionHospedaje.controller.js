const Publicacion = require('../models/publicacionHospedaje.model');
const ContactoHospedero = require('../models/contactoHospedero.model');

// Crear nueva publicación
exports.crearPublicacion = async (req, res) => {
    try {
        const datos = req.body;
        // Validar que el usuario sea hospedero
        const hospedero = await ContactoHospedero.findOne({ idUsuario: datos.idUsuario });
        if (!hospedero) {
            return res.status(403).json({ mensaje: "Debes estar registrado como hospedero para publicar." });
        }
        // Manejar imágenes
        const imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                imagenes.push(file.path);
            }
        }
        if (imagenes.length === 0) {
            return res.status(400).json({ mensaje: "Se requiere al menos una imagen del hospedaje" });
        }
        // Generar idHotel automático
        const ultimo = await Publicacion.findOne().sort({ idHotel: -1 }).lean();
        let nuevoId = "H000001";
        if (ultimo && ultimo.idHotel) {
            const num = parseInt(ultimo.idHotel.slice(1)) + 1;
            nuevoId = "H" + num.toString().padStart(6, "0");
        }
        // Preparar datos
        const datosPublicacion = {
            idHotel: nuevoId,
            Nombre: datos.Nombre || '',
            Imagenes: imagenes,
            Ubicacion: datos.Ubicacion || '',
            Horario: datos.Horario || '',
            Telefono: datos.Telefono || '',
            Huespedes: datos.Huespedes || '',
            Precio: parseFloat(datos.Precio) || 0,
            Servicios: datos.Servicios || '',
            Coordenadas: {
                lat: parseFloat(datos['Coordenadas.lat']) || 0,
                lng: parseFloat(datos['Coordenadas.lng']) || 0
            },
            Categoria: datos.Categoria || 'Economico',
            idUsuario: datos.idUsuario,
            idHospedero: datos.idHospedero,
            estadoRevision: 'pendiente',
            fechaSolicitud: new Date()
        };
        const nueva = new Publicacion(datosPublicacion);
        const guardada = await nueva.save();
        res.status(201).json(guardada);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear publicación", error });
    }
};

// Obtener todas las publicaciones
exports.obtenerPublicaciones = async (req, res) => {
    try {
        const publicaciones = await Publicacion.find();
        res.json(publicaciones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener publicaciones", error });
    }
};

// Obtener publicación por ID
exports.obtenerPublicacionPorId = async (req, res) => {
    try {
        const publicacion = await Publicacion.findById(req.params.id);
        if (!publicacion) return res.status(404).json({ mensaje: "Publicación no encontrada" });
        res.json(publicacion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar publicación", error });
    }
};

// Actualizar publicación
exports.actualizarPublicacion = async (req, res) => {
    try {
        const actualizada = await Publicacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizada) return res.status(404).json({ mensaje: "Publicación no encontrada" });
        res.json(actualizada);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar publicación", error });
    }
};

// Eliminar publicación
exports.eliminarPublicacion = async (req, res) => {
    try {
        const eliminada = await Publicacion.findByIdAndDelete(req.params.id);
        if (!eliminada) return res.status(404).json({ mensaje: "Publicación no encontrada" });
        res.json({ mensaje: "Publicación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar publicación", error });
    }
};
