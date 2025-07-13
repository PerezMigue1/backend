const LugarTuristico = require('../models/lugarTuristico.model');
const CategoriaLugar = require('../models/categoriaLugar.model');

// Crear lugar turístico
exports.crearLugar = async (req, res) => {
    try {
        const nuevoLugar = new LugarTuristico(req.body);
        await nuevoLugar.save();
        res.status(201).json(nuevoLugar);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        const lugar = await LugarTuristico.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lugar) return res.status(404).json({ error: 'Lugar no encontrado' });
        res.json(lugar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar lugar
exports.eliminarLugar = async (req, res) => {
    try {
        const lugar = await LugarTuristico.findByIdAndDelete(req.params.id);
        if (!lugar) return res.status(404).json({ error: 'Lugar no encontrado' });
        res.json({ mensaje: 'Lugar eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
