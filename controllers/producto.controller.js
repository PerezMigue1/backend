const Producto = require("../models/producto.model");

// ✅ Obtener todos los productos
// Obtener todos los productos aprobados
exports.obtenerProductos = async (req, res) => {
    try {
        const { categoria, artesano, search } = req.query;
        let query = { estado: "activo" };
        
        if (categoria) query.idCategoria = categoria;
        if (artesano) query.idArtesano = artesano;
        if (search) query.$text = { $search: search };
        
        const productos = await Producto.find(query)
            .sort({ fechaAprobacion: -1 });
        
        res.json(productos);
    } catch (error) {
        console.error("❌ Error al obtener productos:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findOne({ idProducto: req.params.id });
        
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        console.error("❌ Error al obtener producto:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// ✅ Crear nuevo producto
exports.crearProducto = async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json({
            message: "Producto creado correctamente",
            producto: nuevoProducto
        });
    } catch (error) {
        console.error("❌ Error al crear producto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// ✅ Actualizar producto por idProducto
exports.actualizarProducto = async (req, res) => {
    try {
        const productoActualizado = await Producto.findOneAndUpdate(
            { idProducto: req.params.id },
            req.body,
            { new: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({
            message: "Producto actualizado correctamente",
            producto: productoActualizado
        });
    } catch (error) {
        console.error("❌ Error al actualizar producto:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Eliminar producto por idProducto
exports.eliminarProducto = async (req, res) => {
    try {
        const productoEliminado = await Producto.findOneAndDelete({ idProducto: req.params.id });

        if (!productoEliminado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({
            message: "Producto eliminado correctamente",
            producto: productoEliminado
        });
    } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
