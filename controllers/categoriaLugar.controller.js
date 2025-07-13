const CategoriaLugar = require('../models/categoriaLugar.model');

// Crear categoría
exports.crearCategoria = async (req, res) => {
    try {
        const nuevaCategoria = new CategoriaLugar(req.body);
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await CategoriaLugar.find();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener categoría por ID
exports.obtenerCategoriaPorId = async (req, res) => {
    try {
        const categoria = await CategoriaLugar.findById(req.params.id);
        if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar categoría
exports.actualizarCategoria = async (req, res) => {
    try {
        const categoria = await CategoriaLugar.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json(categoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
    try {
        const categoria = await CategoriaLugar.findByIdAndDelete(req.params.id);
        if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
