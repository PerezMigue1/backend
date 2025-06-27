const Categoria = require("../models/categoriaProducto.model");

// ✅ Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        console.error("❌ Error al obtener categorías:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Obtener categoría por ID
exports.obtenerCategoriaPorId = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        res.json(categoria);
    } catch (error) {
        console.error("❌ Error al obtener categoría:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Crear nueva categoría
exports.crearCategoria = async (req, res) => {
    try {
        const nuevaCategoria = new Categoria(req.body);
        await nuevaCategoria.save();
        res.status(201).json({
            message: "Categoría creada correctamente",
            categoria: nuevaCategoria
        });
    } catch (error) {
        console.error("❌ Error al crear categoría:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// ✅ Actualizar categoría
exports.actualizarCategoria = async (req, res) => {
    try {
        const categoriaActualizada = await Categoria.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!categoriaActualizada) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.json({
            message: "Categoría actualizada correctamente",
            categoria: categoriaActualizada
        });
    } catch (error) {
        console.error("❌ Error al actualizar categoría:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
    try {
        const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);

        if (!categoriaEliminada) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.json({
            message: "Categoría eliminada correctamente",
            categoria: categoriaEliminada
        });
    } catch (error) {
        console.error("❌ Error al eliminar categoría:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
