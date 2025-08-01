const Ecoturismo = require('../models/ecoturismo.model');

// ✅ Obtener todos los destinos de ecoturismo (público)
exports.obtenerEcoturismoPublico = async (req, res) => {
    try {
        const ecoturismo = await Ecoturismo.find({ estado: 'activo' })
            .sort({ destacado: -1, createdAt: -1 });
        
        res.json({
            success: true,
            data: ecoturismo
        });
    } catch (error) {
        console.error('❌ Error al obtener ecoturismo público:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// ✅ Obtener destino por ID (público)
exports.obtenerEcoturismoPorId = async (req, res) => {
    try {
        const ecoturismo = await Ecoturismo.findById(req.params.id);
        
        if (!ecoturismo) {
            return res.status(404).json({
                success: false,
                message: 'Destino de ecoturismo no encontrado'
            });
        }

        // Incrementar contador de visitas
        ecoturismo.visitas += 1;
        await ecoturismo.save();
        
        res.json({
            success: true,
            data: ecoturismo
        });
    } catch (error) {
        console.error('❌ Error al obtener ecoturismo por ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// ✅ Obtener destinos por categoría (público)
exports.obtenerEcoturismoPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        
        const ecoturismo = await Ecoturismo.find({ 
            categoria: categoria,
            estado: 'activo' 
        }).sort({ destacado: -1, createdAt: -1 });
        
        res.json({
            success: true,
            data: ecoturismo
        });
    } catch (error) {
        console.error('❌ Error al obtener ecoturismo por categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// ✅ Obtener destinos destacados (público)
exports.obtenerEcoturismoDestacado = async (req, res) => {
    try {
        const ecoturismo = await Ecoturismo.find({ 
            destacado: true,
            estado: 'activo' 
        }).sort({ createdAt: -1 }).limit(6);
        
        res.json({
            success: true,
            data: ecoturismo
        });
    } catch (error) {
        console.error('❌ Error al obtener ecoturismo destacado:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// ✅ Buscar destinos (público)
exports.buscarEcoturismo = async (req, res) => {
    try {
        const { q, categoria, dificultad } = req.query;
        
        let filtro = { estado: 'activo' };
        
        if (q) {
            filtro.$or = [
                { nombre: { $regex: q, $options: 'i' } },
                { descripcion: { $regex: q, $options: 'i' } },
                { ubicacion: { $regex: q, $options: 'i' } }
            ];
        }
        
        if (categoria) {
            filtro.categoria = categoria;
        }
        
        if (dificultad) {
            filtro.dificultad = dificultad;
        }
        
        const ecoturismo = await Ecoturismo.find(filtro)
            .sort({ destacado: -1, createdAt: -1 });
        
        res.json({
            success: true,
            data: ecoturismo
        });
    } catch (error) {
        console.error('❌ Error al buscar ecoturismo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// ===== FUNCIONES ADMINISTRATIVAS =====

// ✅ Obtener todos los destinos (admin)
exports.obtenerTodosEcoturismo = async (req, res) => {
    try {
        const ecoturismo = await Ecoturismo.find()
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: ecoturismo
        });
    } catch (error) {
        console.error('❌ Error al obtener todos los ecoturismo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// ✅ Crear nuevo destino de ecoturismo (admin)
exports.crearEcoturismo = async (req, res) => {
    try {
        // Procesar imágenes subidas
        const imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                imagenes.push(file.path);
            }
        }

        // Combinar con URLs existentes si las hay
        const imagenesExistentes = req.body.imagenes ? JSON.parse(req.body.imagenes) : [];
        const todasLasImagenes = [...imagenesExistentes, ...imagenes];

        // Parsear campos que vienen como JSON strings
        const datosEcoturismo = {
            ...req.body,
            imagenes: todasLasImagenes,
            coordenadas: req.body.coordenadas ? JSON.parse(req.body.coordenadas) : { latitud: 0, longitud: 0 },
            horarios: req.body.horarios ? JSON.parse(req.body.horarios) : { apertura: '', cierre: '' },
            contacto: req.body.contacto ? JSON.parse(req.body.contacto) : { telefono: '', email: '', sitio_web: '' },
            equipamiento: req.body.equipamiento ? JSON.parse(req.body.equipamiento) : [],
            servicios_disponibles: req.body.servicios_disponibles ? JSON.parse(req.body.servicios_disponibles) : [],
            precio_entrada: parseFloat(req.body.precio_entrada) || 0,
            calificacion: parseFloat(req.body.calificacion) || 0,
            visitas: parseInt(req.body.visitas) || 0,
            destacado: req.body.destacado === 'true' || req.body.destacado === true
        };

        const nuevoEcoturismo = new Ecoturismo(datosEcoturismo);
        await nuevoEcoturismo.save();
        
        res.status(201).json({
            success: true,
            message: 'Destino de ecoturismo creado correctamente',
            data: nuevoEcoturismo
        });
    } catch (error) {
        console.error('❌ Error al crear ecoturismo:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Datos de validación incorrectos',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// ✅ Actualizar destino de ecoturismo (admin)
exports.actualizarEcoturismo = async (req, res) => {
    try {
        // Procesar imágenes subidas
        const imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                imagenes.push(file.path);
            }
        }

        // Combinar con URLs existentes si las hay
        const imagenesExistentes = req.body.imagenes ? JSON.parse(req.body.imagenes) : [];
        const todasLasImagenes = [...imagenesExistentes, ...imagenes];

        // Parsear campos que vienen como JSON strings
        const datosEcoturismo = {
            ...req.body,
            imagenes: todasLasImagenes,
            coordenadas: req.body.coordenadas ? JSON.parse(req.body.coordenadas) : { latitud: 0, longitud: 0 },
            horarios: req.body.horarios ? JSON.parse(req.body.horarios) : { apertura: '', cierre: '' },
            contacto: req.body.contacto ? JSON.parse(req.body.contacto) : { telefono: '', email: '', sitio_web: '' },
            equipamiento: req.body.equipamiento ? JSON.parse(req.body.equipamiento) : [],
            servicios_disponibles: req.body.servicios_disponibles ? JSON.parse(req.body.servicios_disponibles) : [],
            precio_entrada: parseFloat(req.body.precio_entrada) || 0,
            calificacion: parseFloat(req.body.calificacion) || 0,
            visitas: parseInt(req.body.visitas) || 0,
            destacado: req.body.destacado === 'true' || req.body.destacado === true
        };

        const ecoturismoActualizado = await Ecoturismo.findByIdAndUpdate(
            req.params.id,
            datosEcoturismo,
            { new: true, runValidators: true }
        );
        
        if (!ecoturismoActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Destino de ecoturismo no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Destino de ecoturismo actualizado correctamente',
            data: ecoturismoActualizado
        });
    } catch (error) {
        console.error('❌ Error al actualizar ecoturismo:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Datos de validación incorrectos',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// ✅ Eliminar destino de ecoturismo (admin)
exports.eliminarEcoturismo = async (req, res) => {
    try {
        const ecoturismoEliminado = await Ecoturismo.findByIdAndDelete(req.params.id);
        
        if (!ecoturismoEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Destino de ecoturismo no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Destino de ecoturismo eliminado correctamente',
            data: ecoturismoEliminado
        });
    } catch (error) {
        console.error('❌ Error al eliminar ecoturismo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// ✅ Obtener estadísticas de ecoturismo (admin)
exports.obtenerEstadisticasEcoturismo = async (req, res) => {
    try {
        const total = await Ecoturismo.countDocuments();
        const activos = await Ecoturismo.countDocuments({ estado: 'activo' });
        const destacados = await Ecoturismo.countDocuments({ destacado: true });
        const porCategoria = await Ecoturismo.aggregate([
            {
                $group: {
                    _id: '$categoria',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const masVisitados = await Ecoturismo.find()
            .sort({ visitas: -1 })
            .limit(5)
            .select('nombre visitas');
        
        res.json({
            success: true,
            data: {
                total,
                activos,
                destacados,
                porCategoria,
                masVisitados
            }
        });
    } catch (error) {
        console.error('❌ Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}; 