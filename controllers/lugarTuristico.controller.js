const LugarTuristico = require('../models/lugarTuristico.model');
const CategoriaLugar = require('../models/categoriaLugar.model');

// Crear lugar turístico
exports.crearLugar = async (req, res) => {
    try {
        // Procesar imágenes subidas
        const imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                imagenes.push(file.path);
            }
        }

        // Combinar con URLs existentes si las hay
        const imagenesExistentes = req.body.Imagen ? JSON.parse(req.body.Imagen) : [];
        const todasLasImagenes = [...imagenesExistentes, ...imagenes];

        // Parsear campos que vienen como JSON strings
        const datosLugar = {
            ...req.body,
            Imagen: todasLasImagenes,
            LinkEducativos: req.body.LinkEducativos ? JSON.parse(req.body.LinkEducativos) : [],
            Ubicacion: req.body.Ubicacion ? JSON.parse(req.body.Ubicacion) : {
                Estado: '',
                Municipio: '',
                Coordenadas: { lat: 0, lng: 0 }
            }
        };

        const nuevoLugar = new LugarTuristico(datosLugar);
        await nuevoLugar.save();
        
        res.status(201).json({
            success: true,
            message: 'Lugar turístico creado correctamente',
            data: nuevoLugar
        });
    } catch (error) {
        console.error('❌ Error al crear lugar:', error);
        
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

// Obtener todos los lugares turísticos con nombre de categoría
exports.obtenerLugares = async (req, res) => {
    try {
        const lugares = await LugarTuristico.find();
        const categorias = await CategoriaLugar.find();

        // Combinar nombre de categoría manualmente
        const lugaresConCategoriaNombre = lugares.map(lugar => {
            const categoria = categorias.find(ctg => ctg.idCtgLugar === lugar.Categoria);
            return {
                ...lugar.toObject(),
                Categoria: categoria ? categoria.Nombre : lugar.Categoria
            };
        });

        res.json(lugaresConCategoriaNombre);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los lugares turísticos' });
    }
};

// Obtener lugar por ID
exports.obtenerLugarPorId = async (req, res) => {
    try {
        const lugar = await LugarTuristico.findById(req.params.id).populate('Categoria');
        if (!lugar) return res.status(404).json({ error: 'Lugar no encontrado' });
        res.json(lugar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar lugar
exports.actualizarLugar = async (req, res) => {
    try {
        // Procesar imágenes subidas
        const imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                imagenes.push(file.path);
            }
        }

        // Combinar con URLs existentes si las hay
        const imagenesExistentes = req.body.Imagen ? JSON.parse(req.body.Imagen) : [];
        const todasLasImagenes = [...imagenesExistentes, ...imagenes];

        // Parsear campos que vienen como JSON strings
        const datosLugar = {
            ...req.body,
            Imagen: todasLasImagenes,
            LinkEducativos: req.body.LinkEducativos ? JSON.parse(req.body.LinkEducativos) : [],
            Ubicacion: req.body.Ubicacion ? JSON.parse(req.body.Ubicacion) : {
                Estado: '',
                Municipio: '',
                Coordenadas: { lat: 0, lng: 0 }
            }
        };

        const lugar = await LugarTuristico.findByIdAndUpdate(req.params.id, datosLugar, { new: true, runValidators: true });
        
        if (!lugar) {
            return res.status(404).json({
                success: false,
                message: 'Lugar no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Lugar turístico actualizado correctamente',
            data: lugar
        });
    } catch (error) {
        console.error('❌ Error al actualizar lugar:', error);
        
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

// Eliminar lugar
exports.eliminarLugar = async (req, res) => {
    try {
        const lugar = await LugarTuristico.findByIdAndDelete(req.params.id);
        
        if (!lugar) {
            return res.status(404).json({
                success: false,
                message: 'Lugar no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Lugar turístico eliminado correctamente',
            data: lugar
        });
    } catch (error) {
        console.error('❌ Error al eliminar lugar:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
