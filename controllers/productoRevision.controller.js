const ProductoPendiente = require('../models/productoRevision.model');

// Obtener todos los productos pendientes
exports.obtenerTodos = async (req, res) => {
    try {
        const productos = await ProductoPendiente.find();
        res.json(productos);
    } catch (error) {
        console.error("❌ Error al obtener productos pendientes:", error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Obtener producto pendiente por ID personalizado
exports.obtenerPorId = async (req, res) => {
    try {
        const producto = await ProductoPendiente.findOne({ idProducto: req.params.id });
        if (!producto) {
            return res.status(404).json({ message: 'Producto pendiente no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Crear nuevo producto pendiente
exports.crear = async (req, res) => {
    try {
        const nuevo = new ProductoPendiente(req.body);
        await nuevo.save();
        res.status(201).json({ message: 'Producto pendiente creado', producto: nuevo });
    } catch (error) {
        console.error("❌ Error al crear producto:", error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Actualizar producto pendiente
exports.actualizar = async (req, res) => {
    try {
        const actualizado = await ProductoPendiente.findOneAndUpdate(
            { idProducto: req.params.id },
            req.body,
            { new: true }
        );
        if (!actualizado) {
            return res.status(404).json({ message: 'Producto pendiente no encontrado' });
        }
        res.json({ message: 'Producto actualizado', producto: actualizado });
    } catch (error) {
        console.error("❌ Error al actualizar:", error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Eliminar producto pendiente
exports.eliminar = async (req, res) => {
    try {
        const eliminado = await ProductoPendiente.findOneAndDelete({ idProducto: req.params.id });
        if (!eliminado) {
            return res.status(404).json({ message: 'Producto pendiente no encontrado' });
        }
        res.json({ message: 'Producto eliminado', producto: eliminado });
    } catch (error) {
        console.error("❌ Error al eliminar:", error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
