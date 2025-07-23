<<<<<<< HEAD
const Publicacion = require('../models/publicacionHospedaje.model');
const ContactoHospedero = require('../models/contactoHospedero.model');
const Notificacion = require('../models/notificacion.model');
const Hospedaje = require('../models/hospedaje.model');

// Generar ID consecutivo tipo "H000001" de forma segura
const generarIdHotelSeguro = async () => {
    let intentos = 0;
    let nuevoId;
    while (intentos < 5) {
        const ultimo = await Publicacion.findOne().sort({ idHotel: -1 }).lean();
        if (ultimo && ultimo.idHotel) {
            const num = parseInt(ultimo.idHotel.slice(1)) + 1;
            nuevoId = "H" + num.toString().padStart(6, "0");
        } else {
            nuevoId = "H000001";
        }
        const existe = await Publicacion.findOne({ idHotel: nuevoId });
        if (!existe) return nuevoId;
        intentos++;
    }
    return "H" + Date.now().toString().slice(-6);
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

        // Manejo de imágenes (array)
        let imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            imagenes = req.files.map(file => file.path);
        } else if (req.files && req.files.Imagenes) {
            // Multer puede poner los archivos en req.files.Imagenes
            if (Array.isArray(req.files.Imagenes)) {
                imagenes = req.files.Imagenes.map(file => file.path);
            } else {
                imagenes = [req.files.Imagenes.path];
            }
        }
        if (imagenes.length === 0) {
            return res.status(400).json({ mensaje: "Se requiere al menos una imagen del hospedaje" });
        }

        const nuevoId = await generarIdHotelSeguro();

        // Guardar todos los campos tal como se reciben
        const datosPublicacion = {
            idHotel: nuevoId,
            ...datos,
            Imagenes: imagenes,
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

        // Crear documento en la colección hospedaje (solo campos válidos)
        const hospedajeData = {
            idHotel: publicacion.idHotel,
            Nombre: publicacion.Nombre,
            Imagenes: publicacion.Imagenes,
            Ubicacion: publicacion.Ubicacion,
            Horario: publicacion.Horario,
            Telefono: publicacion.Telefono,
            Huespedes: publicacion.Huespedes,
            Precio: publicacion.Precio,
            Servicios: publicacion.Servicios,
            Coordenadas: publicacion.Coordenadas,
            Categoria: publicacion.Categoria
        };
        // Evitar duplicados
        const existe = await Hospedaje.findOne({ idHotel: publicacion.idHotel });
        if (!existe) {
            const nuevoHospedaje = new Hospedaje(hospedajeData);
            await nuevoHospedaje.save();
        }

        // Notificación igual que productos
        const notificacion = new Notificacion({
            idUsuario: publicacion.idUsuario,
            tipo: 'hospedaje',
            hospedaje: publicacion.Nombre,
            estado: 'aprobado',
            mensaje: `Tu hospedaje "${publicacion.Nombre}" ha sido aprobado y publicado exitosamente.`,
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

        // Notificación igual que productos
        const notificacion = new Notificacion({
            idUsuario: publicacion.idUsuario,
            tipo: 'hospedaje',
            hospedaje: publicacion.Nombre,
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
=======
const Publicacion = require('../models/publicacionHospedaje.model');
const ContactoHospedero = require('../models/contactoHospedero.model');
const Notificacion = require('../models/notificacion.model');


// Generar ID consecutivo tipo "H000001" de forma segura
const generarIdHotelSeguro = async () => {
    let intentos = 0;
    let nuevoId;
    while (intentos < 5) {
        const ultimo = await Publicacion.findOne().sort({ idHotel: -1 }).lean();
        if (ultimo && ultimo.idHotel) {
            const num = parseInt(ultimo.idHotel.slice(1)) + 1;
            nuevoId = "H" + num.toString().padStart(6, "0");
        } else {
            nuevoId = "H000001";
        }
        // Verifica si ya existe
        const existe = await Publicacion.findOne({ idHotel: nuevoId });
        if (!existe) return nuevoId;
        intentos++;
    }
    // Fallback: usa timestamp
    return "H" + Date.now().toString().slice(-6);
};

// Crear nueva publicación de hospedaje
exports.crearPublicacion = async (req, res) => {
    try {
        console.log("📥 BODY recibido:", req.body);
        console.log("📸 FILES recibidos:", req.files);

        const datos = req.body;

        // Validar que vengan idUsuario e idHospedero
        if (!datos.idUsuario || !datos.idHospedero) {
            return res.status(400).json({ mensaje: "Faltan datos de usuario o hospedero" });
        }

        // Buscar hospedero válido
        const hospedero = await ContactoHospedero.findOne({
            idHospedero: datos.idHospedero,
            idUsuario: datos.idUsuario
        });
        if (!hospedero) {
            return res.status(403).json({ mensaje: "No tienes permisos para publicar con este hospedero." });
        }

        // Procesar imágenes
        const imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                imagenes.push(file.path);
            }
        }
        if (imagenes.length === 0) {
            return res.status(400).json({ mensaje: "Se requiere al menos una imagen del hospedaje" });
        }

        // Validar campos obligatorios
        const camposObligatorios = [
            'Nombre', 'Ubicacion', 'Horario', 'Telefono', 'Huespedes', 'Precio', 'Servicios', 'Categoria', 'Coordenadas.lat', 'Coordenadas.lng'
        ];
        for (const campo of camposObligatorios) {
            if (!datos[campo] || datos[campo] === '') {
                return res.status(400).json({ mensaje: `El campo '${campo}' es obligatorio.` });
            }
        }





        // Generar ID consecutivo SEGURO
        const nuevoId = await generarIdHotelSeguro();




        
        // Preparar datos de la publicación
        const datosPublicacion = {
            idHotel: nuevoId,
            Nombre: datos.Nombre,
            Imagenes: imagenes,
            Ubicacion: datos.Ubicacion,
            Horario: datos.Horario,
            Telefono: datos.Telefono,
            Huespedes: datos.Huespedes,
            Precio: parseFloat(datos.Precio),
            Servicios: datos.Servicios,
            Coordenadas: {
                lat: parseFloat(datos['Coordenadas.lat']),
                lng: parseFloat(datos['Coordenadas.lng'])
            },
            Categoria: datos.Categoria,
            idUsuario: datos.idUsuario,
            idHospedero: datos.idHospedero,
            estadoRevision: 'pendiente',
            fechaSolicitud: new Date()
        };

        console.log("📋 Datos de la publicación a guardar:", datosPublicacion);

        // Crear y guardar la publicación
        const nueva = new Publicacion(datosPublicacion);
        await nueva.save();

        console.log("✅ Publicación guardada exitosamente");

        res.status(201).json({
            mensaje: "✅ Publicación creada y enviada a revisión",
            publicacion: nueva
        });
    } catch (error) {
        console.error("❌ Error al crear publicación:", error.message);
        console.error("❌ Error completo:", error);
        res.status(500).json({ mensaje: "Error al crear publicación", error: error.message });
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
>>>>>>> 6e97a90 (Mensaje de)
