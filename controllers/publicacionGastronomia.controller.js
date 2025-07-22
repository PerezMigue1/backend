const Publicacion = require('../models/publicacionGastronomia.model');
const ContactoChef = require('../models/contactoChef.model');

// Crear nueva publicación gastronómica
exports.crearPublicacion = async (req, res) => {
    try {
        const datos = req.body;

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

        // Generar idPlatillo automático
        const ultimo = await Publicacion.findOne().sort({ idPlatillo: -1 }).lean();
        let nuevoId = "P000001";
        if (ultimo && ultimo.idPlatillo) {
            const num = parseInt(ultimo.idPlatillo.slice(1)) + 1;
            nuevoId = "P" + num.toString().padStart(6, "0");
        }

        // Preparar datos según estructura completa
        const datosPublicacion = {
            idPlatillo: nuevoId,
            nombre: datos.nombre || '',
            descripcion: datos.descripcion || '',
            ingredientes: datos.ingredientes || [''],
            receta: {
                pasos: datos.receta?.pasos || [''],
                tiempoPreparacionMinutos: datos.receta?.tiempoPreparacionMinutos || '',
                tiempoCoccionHoras: datos.receta?.tiempoCoccionHoras || '',
                porciones: datos.receta?.porciones || ''
            },
            consejosServir: datos.consejosServir || [''],
            tipoPlatillo: datos.tipoPlatillo || '',
            regionOrigen: datos.regionOrigen || '',
            historiaOrigen: datos.historiaOrigen || '',
            ocasion: datos.ocasion || [''],
            ubicacionDondeEncontrar: Array.isArray(datos.ubicacionDondeEncontrar) ? datos.ubicacionDondeEncontrar.map(lugar => ({
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

        const nueva = new Publicacion(datosPublicacion);
        const guardada = await nueva.save();
        res.status(201).json(guardada);

    } catch (error) {
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