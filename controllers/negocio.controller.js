const Negocio = require("../models/negocio.model"); 
 
// ✅ Obtener todos los negocios 
exports.obtenerNegocios = async (req, res) => { 
    try { 
        const negocios = await Negocio.find(); 
        res.json(negocios); 
    } catch (error) { 
        console.error("❌ Error al obtener negocios:", error); 
        res.status(500).json({ message: "Error en el servidor" }); 
    } 
}; 
 
// ✅ Obtener un negocio por ID 
exports.obtenerNegocioPorId = async (req, res) => { 
    try { 
        const negocio = await Negocio.findById(req.params.id); 
        if (!negocio) { 
            return res.status(404).json({ message: "Negocio no encontrado" }); 
        } 
        res.json(negocio); 
    } catch (error) { 
        console.error("❌ Error al obtener negocio:", error); 
        res.status(500).json({ message: "Error en el servidor" }); 
    } 
}; 
 
// ✅ Crear nuevo negocio 
exports.crearNegocio = async (req, res) => { 
    try { 
        // Procesar imágenes subidas
        const imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                imagenes.push(file.path);
            }
        }

        // Combinar con URLs existentes si las hay
        const imagenesExistentes = req.body.imagenesExistentes ? JSON.parse(req.body.imagenesExistentes) : [];
        const todasLasImagenes = [...imagenesExistentes, ...imagenes];

        // Parsear campos que vienen como JSON strings
        const datosNegocio = {
            ...req.body,
            Imagenes: todasLasImagenes,
            Ubicacion: req.body.Ubicacion ? JSON.parse(req.body.Ubicacion) : {
                Estado: '',
                Municipio: '',
                Coordenadas: { lat: 0, lng: 0 },
                Direccion: ''
            },
            RedesSociales: req.body.RedesSociales ? JSON.parse(req.body.RedesSociales) : {
                Facebook: '',
                Instagram: '',
                WhatsApp: ''
            },
            Reseñas: req.body.Reseñas ? JSON.parse(req.body.Reseñas) : [],
            Recomendado: req.body.Recomendado === 'true' || req.body.Recomendado === true
        };

        const nuevoNegocio = new Negocio(datosNegocio); 
        await nuevoNegocio.save(); 
        
        res.status(201).json({
            success: true,
            message: "Negocio creado correctamente", 
            data: nuevoNegocio 
        }); 
    } catch (error) { 
        console.error("❌ Error al crear negocio:", error); 
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Datos de validación incorrectos',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: "Error interno del servidor" 
        }); 
    } 
}; 
 
// ✅ Actualizar negocio por ID 
exports.actualizarNegocio = async (req, res) => { 
    try { 
        // Procesar imágenes subidas
        const imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                imagenes.push(file.path);
            }
        }

        // Combinar con URLs existentes si las hay
        const imagenesExistentes = req.body.imagenesExistentes ? JSON.parse(req.body.imagenesExistentes) : [];
        const todasLasImagenes = [...imagenesExistentes, ...imagenes];

        // Parsear campos que vienen como JSON strings
        const datosNegocio = {
            ...req.body,
            Imagenes: todasLasImagenes,
            Ubicacion: req.body.Ubicacion ? JSON.parse(req.body.Ubicacion) : {
                Estado: '',
                Municipio: '',
                Coordenadas: { lat: 0, lng: 0 },
                Direccion: ''
            },
            RedesSociales: req.body.RedesSociales ? JSON.parse(req.body.RedesSociales) : {
                Facebook: '',
                Instagram: '',
                WhatsApp: ''
            },
            Reseñas: req.body.Reseñas ? JSON.parse(req.body.Reseñas) : [],
            Recomendado: req.body.Recomendado === 'true' || req.body.Recomendado === true
        };

        const negocioActualizado = await Negocio.findByIdAndUpdate( 
            req.params.id, 
            datosNegocio, 
            { new: true, runValidators: true } 
        ); 

        if (!negocioActualizado) { 
            return res.status(404).json({ 
                success: false,
                message: "Negocio no encontrado" 
            }); 
        } 

        res.json({
            success: true,
            message: "Negocio actualizado correctamente", 
            data: negocioActualizado 
        }); 
    } catch (error) { 
        console.error("❌ Error al actualizar negocio:", error); 
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Datos de validación incorrectos',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: "Error en el servidor" 
        }); 
    } 
}; 
 
// ✅ Eliminar negocio por ID 
exports.eliminarNegocio = async (req, res) => { 
    try { 
        const negocioEliminado = await Negocio.findByIdAndDelete(req.params.id); 

        if (!negocioEliminado) { 
            return res.status(404).json({ 
                success: false,
                message: "Negocio no encontrado" 
            }); 
        } 

        res.json({
            success: true,
            message: "Negocio eliminado correctamente", 
            data: negocioEliminado 
        }); 
    } catch (error) { 
        console.error("❌ Error al eliminar negocio:", error); 
        res.status(500).json({ 
            success: false,
            message: "Error en el servidor" 
        }); 
    } 
};

// ✅ Obtener negocios por categoría
exports.obtenerNegociosPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const negocios = await Negocio.find({ Categoria: categoria });
        res.json(negocios);
    } catch (error) {
        console.error("❌ Error al obtener negocios por categoría:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Obtener negocios por ubicación (estado)
exports.obtenerNegociosPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const negocios = await Negocio.find({ "Ubicacion.Estado": estado });
        res.json(negocios);
    } catch (error) {
        console.error("❌ Error al obtener negocios por estado:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Obtener negocios recomendados
exports.obtenerNegociosRecomendados = async (req, res) => {
    try {
        const negociosRecomendados = await Negocio.find({ Recomendado: true });
        res.json(negociosRecomendados);
    } catch (error) {
        console.error("❌ Error al obtener negocios recomendados:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};