const Publicacion = require('../models/publicacionHospedaje.model');
const ContactoHospedero = require('../models/contactoHospedero.model');
const Notificacion = require('../models/notificacion.model');


// Generar ID consecutivo tipo "H000001"
const generarIdHotel = async () => {
    const ultimo = await Publicacion.findOne().sort({ idHotel: -1 }).lean();
    let nuevoId = "H000001";
    if (ultimo && ultimo.idHotel) {
        const num = parseInt(ultimo.idHotel.slice(1)) + 1;
        nuevoId = "H" + num.toString().padStart(6, "0");
    }
    return nuevoId;
};

// Crear nueva publicación de hospedaje
exports.crearPublicacion = async (req, res) => {
    try {
        const datos = req.body;
        const hospedero = await ContactoHospedero.findOne({
            idHospedero: datos.idHospedero,
            idUsuario: datos.idUsuario
        });

        if (!hospedero) {
            return res.status(403).json({ mensaje: "No tienes permisos para publicar con este hospedero." });
        }

        const imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach(file => imagenes.push(file.path));
        }
        if (imagenes.length === 0) {
            return res.status(400).json({ mensaje: "Se requiere al menos una imagen del hospedaje" });
        }

        const nuevoId = await generarIdHotel();

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
            Categoria: datos.Categoria || 'Económico',
            idUsuario: datos.idUsuario,
            idHospedero: datos.idHospedero,
            estadoRevision: 'pendiente',
            fechaSolicitud: new Date()
        };

        const nueva = new Publicacion(datosPublicacion);
        const guardada = await nueva.save();

        res.status(201).json({
            mensaje: "✅ Publicación creada y enviada a revisión",
            publicacion: guardada
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear publicación", error });
    }
};

// Obtener todas las publicaciones
exports.obtenerPublicaciones = async (req, res) => {
    try {
        const publicaciones = await Publicacion.find();
        res.json(publicaciones);
    } catch (error) {
        console.error("❌ Error al obtener pendientes:", error);
        res.status(500).json({ message: 'Error en el servidor' });
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
        res.status(500).json({ mensaje: "Error al eliminar publicación", error });
    }
};

// Aprobar publicación
exports.aprobarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { revisadoPor, comentarios } = req.body;
        const publicacion = await Publicacion.findOne({ idHotel: id });

        if (!publicacion) return res.status(404).json({ mensaje: "Publicación no encontrada" });

        if (publicacion.estadoRevision !== 'pendiente') {
            return res.status(400).json({ mensaje: "Esta publicación ya fue revisada" });
        }

        publicacion.estadoRevision = 'aprobado';
        publicacion.revisadoPor = revisadoPor || 'admin';
        publicacion.fechaRevision = new Date();
        publicacion.comentarios = comentarios || '';
        await publicacion.save();

        const notificacion = new Notificacion({
            idUsuario: publicacion.idHospedero,
            tipo: 'publicacion',
            producto: publicacion.Nombre,
            estado: 'aprobado',
            mensaje: `Tu hospedaje "${publicacion.Nombre}" fue aprobado y publicado.`,
            fecha: new Date()
        });
        await notificacion.save();

        res.json({ mensaje: "✅ Publicación aprobada", publicacion });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al aprobar publicación", error });
    }
};

// Rechazar publicación
exports.rechazarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { revisadoPor, motivoRechazo, comentarios } = req.body;
        const publicacion = await Publicacion.findOne({ idHotel: id });

        if (!publicacion) return res.status(404).json({ mensaje: "Publicación no encontrada" });

        if (publicacion.estadoRevision !== 'pendiente') {
            return res.status(400).json({ mensaje: "Esta publicación ya fue revisada" });
        }

        publicacion.estadoRevision = 'rechazado';
        publicacion.revisadoPor = revisadoPor || 'admin';
        publicacion.motivoRechazo = motivoRechazo || 'Sin motivo especificado';
        publicacion.fechaRevision = new Date();
        publicacion.comentarios = comentarios || '';
        await publicacion.save();

        const notificacion = new Notificacion({
            idUsuario: publicacion.idHospedero,
            tipo: 'publicacion',
            producto: publicacion.Nombre,
            estado: 'rechazado',
            mensaje: `Tu hospedaje "${publicacion.Nombre}" fue rechazado. Motivo: ${publicacion.motivoRechazo}`,
            fecha: new Date()
        });
        await notificacion.save();

        res.json({ mensaje: "❌ Publicación rechazada", publicacion });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al rechazar publicación", error });
    }
};

// Obtener publicaciones por estado
exports.obtenerPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const validos = ['pendiente', 'aprobado', 'rechazado'];
        if (!validos.includes(estado)) {
            return res.status(400).json({ mensaje: `Estado inválido. Debe ser: ${validos.join(', ')}` });
        }

        const publicaciones = await Publicacion.find({ estadoRevision: estado }).sort({ fechaSolicitud: -1 });
        res.json({ total: publicaciones.length, publicaciones });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al filtrar publicaciones", error });
    }
};

// Obtener estadísticas
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const [pendientes, aprobados, rechazados] = await Promise.all([
            Publicacion.countDocuments({ estadoRevision: 'pendiente' }),
            Publicacion.countDocuments({ estadoRevision: 'aprobado' }),
            Publicacion.countDocuments({ estadoRevision: 'rechazado' })
        ]);

        res.json({
            mensaje: "📊 Estadísticas cargadas correctamente",
            estadisticas: { pendientes, aprobados, rechazados, total: pendientes + aprobados + rechazados }
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener estadísticas", error });
    }
};
