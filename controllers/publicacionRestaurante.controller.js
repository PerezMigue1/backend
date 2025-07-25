const PublicacionRestaurante = require("../models/publicacionRestaurante.model");
const ComidaRestaurante = require("../models/comidaRestaurante.model");
const Restaurante = require("../models/restaurante.model");
const Notificacion = require("../models/notificacion.model");

// Obtener todas las publicaciones
exports.obtenerTodas = async (req, res) => {
    try {
        const publicaciones = await PublicacionRestaurante.find();
        res.json(publicaciones);
    } catch (error) {
        console.error("❌ Error al obtener publicaciones:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener publicación por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const publicacion = await PublicacionRestaurante.findById(req.params.id);
        if (!publicacion) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.json(publicacion);
    } catch (error) {
        console.error("❌ Error al obtener publicación:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Crear nueva publicación
exports.crear = async (req, res) => {
    try {
        const datos = req.body;
        // Manejo de imágenes
        let imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            imagenes = req.files.map(file => file.path);
        } else if (req.body.Imagenes) {
            imagenes = Array.isArray(req.body.Imagenes) ? req.body.Imagenes : [req.body.Imagenes];
        }
        datos.Imagenes = imagenes;
        // Manejo de fechas
        datos.fechaSolicitud = new Date();
        const nuevaPublicacion = new PublicacionRestaurante(datos);
        await nuevaPublicacion.save();
        res.status(201).json({
            message: "✅ Publicación enviada correctamente para revisión",
            publicacion: nuevaPublicacion
        });
    } catch (error) {
        console.error("❌ Error al crear publicación:", error.message);
        res.status(500).json({ message: "Error al crear publicación", error: error.message });
    }
};

// Actualizar publicación
exports.actualizar = async (req, res) => {
    try {
        const actualizada = await PublicacionRestaurante.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!actualizada) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.json({
            message: "✅ Publicación actualizada correctamente",
            publicacion: actualizada
        });
    } catch (error) {
        console.error("❌ Error al actualizar publicación:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar publicación
exports.eliminar = async (req, res) => {
    try {
        const eliminada = await PublicacionRestaurante.findByIdAndDelete(req.params.id);
        if (!eliminada) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        res.json({
            message: "🗑️ Publicación eliminada correctamente",
            publicacion: eliminada
        });
    } catch (error) {
        console.error("❌ Error al eliminar publicación:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Aprobar publicación
exports.aprobar = async (req, res) => {
    try {
        const { id } = req.params;
        const { revisadoPor, comentarios } = req.body;
        const publicacion = await PublicacionRestaurante.findById(id);
        if (!publicacion) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        if (publicacion.estadoRevision !== 'pendiente') {
            return res.status(400).json({ message: 'La publicación ya no está pendiente de revisión' });
        }
        publicacion.estadoRevision = 'aprobado';
        publicacion.revisadoPor = revisadoPor || 'admin';
        publicacion.fechaRevision = new Date();
        await publicacion.save();

        // Mover a la colección final de restaurantes
        const restauranteData = {
            Nombre: publicacion.Nombre,
            Categoria: publicacion.Categoria,
            Descripcion: publicacion.Descripcion,
            Ubicacion: publicacion.Ubicacion,
            RedesSociales: publicacion.RedesSociales,
            Reseñas: publicacion.Reseñas,
            Imagenes: publicacion.Imagenes,
            Horario: publicacion.Horario,
            Contacto: publicacion.Contacto,
            Recomendado: publicacion.Recomendado,
            idRestaurante: publicacion.idRestaurante
        };
        const restaurante = new Restaurante(restauranteData);
        await restaurante.save();

        // Crear notificación para el usuario
        const notificacion = new Notificacion({
            idUsuario: publicacion.idUsuario,
            tipo: 'publicacion',
            producto: publicacion.Nombre,
            estado: 'aprobado',
            mensaje: `Tu restaurante "${publicacion.Nombre}" ha sido aprobado y publicado exitosamente.`,
            fecha: new Date()
        });
        await notificacion.save();

        res.json({
            message: "✅ Publicación aprobada correctamente",
            publicacion,
            restaurante,
            notificacion
        });
    } catch (error) {
        console.error("❌ Error al aprobar publicación:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Rechazar publicación
exports.rechazar = async (req, res) => {
    try {
        const { id } = req.params;
        const { revisadoPor, motivoRechazo, comentarios } = req.body;
        const publicacion = await PublicacionRestaurante.findById(id);
        if (!publicacion) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        if (publicacion.estadoRevision !== 'pendiente') {
            return res.status(400).json({ message: 'La publicación ya no está pendiente de revisión' });
        }
        publicacion.estadoRevision = 'rechazado';
        publicacion.revisadoPor = revisadoPor || 'admin';
        publicacion.motivoRechazo = motivoRechazo || 'No especificado';
        publicacion.fechaRevision = new Date();
        await publicacion.save();
        res.json({
            message: "❌ Publicación rechazada correctamente",
            publicacion
        });
    } catch (error) {
        console.error("❌ Error al rechazar publicación:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener publicaciones por estado de revisión
exports.obtenerPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const estadosValidos = ['pendiente', 'aprobado', 'rechazado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ 
                message: 'Estado no válido',
                error: `Estados válidos: ${estadosValidos.join(', ')}`
            });
        }
        const publicaciones = await PublicacionRestaurante.find({ estadoRevision: estado }).sort({ fechaSolicitud: -1 });
        res.json({
            message: `Publicaciones ${estado}s obtenidas correctamente`,
            publicaciones,
            total: publicaciones.length
        });
    } catch (error) {
        console.error("❌ Error al obtener publicaciones por estado:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener estadísticas de publicaciones por estado
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const [pendientes, aprobadas, rechazadas] = await Promise.all([
            PublicacionRestaurante.countDocuments({ estadoRevision: 'pendiente' }),
            PublicacionRestaurante.countDocuments({ estadoRevision: 'aprobado' }),
            PublicacionRestaurante.countDocuments({ estadoRevision: 'rechazado' })
        ]);
        const total = pendientes + aprobadas + rechazadas;
        res.json({
            message: "Estadísticas obtenidas correctamente",
            estadisticas: {
                total,
                pendientes,
                aprobadas,
                rechazadas
            }
        });
    } catch (error) {
        console.error("❌ Error al obtener estadísticas:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}; 

// Obtener publicación y sus platillos
exports.obtenerDetalleConPlatillos = async (req, res) => {
    try {
        const publicacion = await PublicacionRestaurante.findById(req.params.id);
        if (!publicacion) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        const platillos = await ComidaRestaurante.find({ idRestaurante: publicacion.idRestaurante });
        res.json({ publicacion, platillos });
    } catch (error) {
        console.error("❌ Error al obtener detalle de publicación:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Aprobar platillo (mover a comida-restaurante si la publicación está aprobada)
exports.aprobarPlatillo = async (req, res) => {
    try {
        const { id } = req.params; // id del platillo
        const platillo = await ComidaRestaurante.findById(id);
        if (!platillo) {
            return res.status(404).json({ message: 'Platillo no encontrado' });
        }
        platillo.estadoRevision = 'aprobado';
        await platillo.save();
        res.json({ message: 'Platillo aprobado correctamente', platillo });
    } catch (error) {
        console.error("❌ Error al aprobar platillo:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Rechazar platillo
exports.rechazarPlatillo = async (req, res) => {
    try {
        const { id } = req.params; // id del platillo
        const platillo = await ComidaRestaurante.findById(id);
        if (!platillo) {
            return res.status(404).json({ message: 'Platillo no encontrado' });
        }
        platillo.estadoRevision = 'rechazado';
        await platillo.save();
        res.json({ message: 'Platillo rechazado correctamente', platillo });
    } catch (error) {
        console.error("❌ Error al rechazar platillo:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}; 