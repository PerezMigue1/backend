const Publicacion = require('../models/publicacionGastronomia.model');
const ContactoChef = require('../models/contactoChef.model');
const Notificacion = require('../models/notificacion.model');
const Gastronomia = require('../models/gastronomia.model');

// Crear nueva publicación gastronómica
exports.crearPublicacion = async (req, res) => {
    try {
        const datos = req.body;
        console.log("📥 BODY recibido:", datos);
        // Validar campos obligatorios
        const camposObligatorios = ['idUsuario', 'idChef', 'nombre', 'descripcion'];
        for (const campo of camposObligatorios) {
            if (!datos[campo] || datos[campo] === '') {
                return res.status(400).json({ mensaje: `El campo '${campo}' es obligatorio.` });
            }
        }
        // Validar que el usuario sea chef
        const chef = await ContactoChef.findOne({ idUsuario: datos.idUsuario });
        if (!chef) {
            return res.status(403).json({ mensaje: "Debes estar registrado como chef para publicar un platillo." });
        }
        // Manejar imágenes
        const imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                imagenes.push(file.path);
            }
        }
        if (imagenes.length === 0) {
            return res.status(400).json({ mensaje: "Se requiere al menos una imagen del platillo" });
        }
        // Parsear arrays/objetos si vienen como string
        let ingredientes = datos.ingredientes;
        let receta = datos.receta;
        let consejosServir = datos.consejosServir;
        let ocasion = datos.ocasion;
        let ubicacionDondeEncontrar = datos.ubicacionDondeEncontrar;
        try {
            if (typeof ingredientes === 'string') ingredientes = JSON.parse(ingredientes);
            if (typeof receta === 'string') receta = JSON.parse(receta);
            if (typeof consejosServir === 'string') consejosServir = JSON.parse(consejosServir);
            if (typeof ocasion === 'string') ocasion = JSON.parse(ocasion);
            if (typeof ubicacionDondeEncontrar === 'string') ubicacionDondeEncontrar = JSON.parse(ubicacionDondeEncontrar);
        } catch (err) {
            return res.status(400).json({ mensaje: "Error al parsear campos de tipo array/objeto", error: err.message });
        }
        // Preparar datos de la publicación
        const datosPublicacion = {
            nombre: datos.nombre,
            descripcion: datos.descripcion,
            ingredientes: ingredientes || [''],
            receta: receta || { pasos: [''], tiempoPreparacionMinutos: '', tiempoCoccionHoras: '', porciones: '' },
            consejosServir: consejosServir || [''],
            tipoPlatillo: datos.tipoPlatillo || '',
            regionOrigen: datos.regionOrigen || '',
            historiaOrigen: datos.historiaOrigen || '',
            ocasion: ocasion || [''],
            ubicacionDondeEncontrar: Array.isArray(ubicacionDondeEncontrar) ? ubicacionDondeEncontrar.map(lugar => ({
                nombreLugar: lugar.nombreLugar || '',
                tipoLugar: lugar.tipoLugar || '',
                direccion: lugar.direccion || '',
                coordenadas: {
                    lat: parseFloat(lugar.coordenadas?.lat) || 0,
                    lng: parseFloat(lugar.coordenadas?.lng) || 0
                }
            })) : [],
            imagen: imagenes,
            idUsuario: datos.idUsuario,
            idChef: datos.idChef,
            estadoRevision: 'pendiente',
            fechaSolicitud: new Date()
        };
        console.log("📋 Datos de la publicación a guardar:", datosPublicacion);
        const nueva = new Publicacion(datosPublicacion);
        await nueva.save();
        console.log("✅ Publicación gastronómica guardada exitosamente");
        res.status(201).json({
            mensaje: "✅ Platillo enviado para revisión",
            publicacion: nueva
        });
    } catch (error) {
        console.error("❌ Error al crear publicación gastronómica:", error.message);
        res.status(400).json({ mensaje: "Error al crear publicación gastronómica", error });
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

// Obtener publicación por ID (MongoDB _id)
exports.obtenerPorId = async (req, res) => {
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
        res.json({
            mensaje: "✅ Publicación actualizada correctamente",
            publicacion: actualizada
        });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar publicación", error });
    }
};

// Eliminar publicación
exports.eliminarPublicacion = async (req, res) => {
    try {
        const eliminada = await Publicacion.findByIdAndDelete(req.params.id);
        if (!eliminada) return res.status(404).json({ mensaje: "Publicación no encontrada" });
        res.json({ mensaje: "🗑️ Publicación eliminada correctamente", publicacion: eliminada });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar publicación", error });
    }
};

// Aprobar publicación
exports.aprobarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { revisadoPor, comentarios } = req.body;
        const publicacion = await Publicacion.findById(id);
        if (!publicacion) return res.status(404).json({ mensaje: "Publicación no encontrada" });
        if (publicacion.estadoRevision !== 'pendiente') {
            return res.status(400).json({ mensaje: "Esta publicación ya fue revisada" });
        }
        publicacion.estadoRevision = 'aprobado';
        publicacion.revisadoPor = revisadoPor || 'admin';
        publicacion.fechaRevision = new Date();
        publicacion.comentarios = comentarios || '';
        await publicacion.save();
        // Copiar a la colección final Gastronomia
        const nuevoPlatillo = new Gastronomia({
            nombre: publicacion.nombre,
            imagen: Array.isArray(publicacion.imagen) && publicacion.imagen.length > 0
                ? { url: publicacion.imagen[0] } : { url: '' },
            descripcion: publicacion.descripcion,
            ingredientes: publicacion.ingredientes,
            receta: {
                pasos: publicacion.receta?.pasos || [],
                tiempoPreparacionMinutos: Number(publicacion.receta?.tiempoPreparacionMinutos) || 0,
                tiempoCoccionHoras: Number(publicacion.receta?.tiempoCoccionHoras) || 0,
                porciones: Number(publicacion.receta?.porciones) || 0
            },
            consejosServir: publicacion.consejosServir,
            tipoPlatillo: publicacion.tipoPlatillo,
            regionOrigen: publicacion.regionOrigen,
            historiaOrigen: publicacion.historiaOrigen,
            ocasion: publicacion.ocasion,
            ubicacionDondeEncontrar: publicacion.ubicacionDondeEncontrar
        });
        await nuevoPlatillo.save();
        // Notificación
        const notificacion = new Notificacion({
            idUsuario: publicacion.idChef,
            tipo: 'publicacion',
            producto: publicacion.nombre,
            estado: 'aprobado',
            mensaje: `Tu platillo "${publicacion.nombre}" fue aprobado y publicado.`,
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
        const publicacion = await Publicacion.findById(id);
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
        // Notificación
        const notificacion = new Notificacion({
            idUsuario: publicacion.idChef,
            tipo: 'publicacion',
            producto: publicacion.nombre,
            estado: 'rechazado',
            mensaje: `Tu platillo "${publicacion.nombre}" fue rechazado. Motivo: ${publicacion.motivoRechazo}`,
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