// controllers/productoRevision.controller.js
const ProductoRevision = require("../models/productoRevision.model");
const Producto = require("../models/producto.model"); // Necesitarás crear este modelo
const mongoose = require("mongoose");

// Obtener publicaciones con filtro por estado
exports.obtenerTodos = async (req, res) => {
    try {
        const { estado } = req.query;
        let query = {};
        
        if (estado) {
            query.estadoRevision = estado;
        }
        
        const productos = await ProductoRevision.find(query)
            .populate('revisadoPor', 'nombre email'); // Populate para obtener datos del revisor
        
        res.json(productos);
    } catch (error) {
        console.error("❌ Error al obtener publicaciones:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener publicación por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const producto = await ProductoRevision.findOne({ idProducto: req.params.id })
            .populate('revisadoPor', 'nombre email');
        
        if (!producto) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        res.json(producto);
    } catch (error) {
        console.error("❌ Error al obtener publicación:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Crear nueva publicación
exports.crear = async (req, res) => {
    const datos = req.body;

    try {
        // Validar datos requeridos
        if (!datos.idUsuario || !datos.idArtesano) {
            return res.status(400).json({ message: "Faltan datos de usuario o artesano" });
        }

        // Generar idProducto consecutivo
        const ultimo = await ProductoRevision.findOne().sort({ createdAt: -1 }).lean();
        let nuevoId = "P000001";
        if (ultimo && ultimo.idProducto) {
            const num = parseInt(ultimo.idProducto.slice(1)) + 1;
            nuevoId = "P" + num.toString().padStart(6, "0");
        }

        // Crear nueva publicación
        const nuevaPublicacion = new ProductoRevision({
            idProducto: nuevoId,
            ...datos,
            estadoRevision: "pendiente",
            fechaSolicitud: new Date()
        });

        await nuevaPublicacion.save();

        res.status(201).json({
            message: "✅ Publicación enviada correctamente para revisión",
            publicacion: nuevaPublicacion
        });

    } catch (error) {
        console.error("❌ Error al crear publicación:", error.message);
        res.status(500).json({ message: "Error al crear publicación", error: error.message });
    }
};

// Aprobar una publicación
exports.aprobarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { idAdmin } = req.body; // ID del administrador que aprueba

        // Buscar la publicación
        const publicacion = await ProductoRevision.findOne({ idProducto: id });
        if (!publicacion) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        // Verificar que esté pendiente
        if (publicacion.estadoRevision !== 'pendiente') {
            return res.status(400).json({ message: 'La publicación ya fue revisada' });
        }

        // Actualizar estado
        publicacion.estadoRevision = 'aprobado';
        publicacion.revisadoPor = idAdmin;
        publicacion.fechaRevision = new Date();
        publicacion.motivoRechazo = null;
        
        await publicacion.save();

        // Crear el producto aprobado en la colección de productos
        const nuevoProducto = new Producto({
            ...publicacion.toObject(),
            _id: new mongoose.Types.ObjectId(),
            idProducto: publicacion.idProducto,
            estado: 'activo'
        });
        
        await nuevoProducto.save();

        res.json({
            message: "✅ Publicación aprobada correctamente",
            publicacion,
            producto: nuevoProducto
        });
    } catch (error) {
        console.error("❌ Error al aprobar publicación:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Rechazar una publicación
exports.rechazarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { idAdmin, motivo } = req.body; // ID del administrador y motivo

        // Buscar la publicación
        const publicacion = await ProductoRevision.findOne({ idProducto: id });
        if (!publicacion) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        // Verificar que esté pendiente
        if (publicacion.estadoRevision !== 'pendiente') {
            return res.status(400).json({ message: 'La publicación ya fue revisada' });
        }

        // Actualizar estado
        publicacion.estadoRevision = 'rechazado';
        publicacion.revisadoPor = idAdmin;
        publicacion.fechaRevision = new Date();
        publicacion.motivoRechazo = motivo;
        
        await publicacion.save();

        res.json({
            message: "❌ Publicación rechazada correctamente",
            publicacion
        });
    } catch (error) {
        console.error("❌ Error al rechazar publicación:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar publicación (solo para administradores)
exports.actualizarPublicacion = async (req, res) => {
    try {
        const publicacionActualizada = await ProductoRevision.findOneAndUpdate(
            { idProducto: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!publicacionActualizada) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        res.json({
            message: "✅ Publicación actualizada correctamente",
            publicacion: publicacionActualizada
        });
    } catch (error) {
        console.error("❌ Error al actualizar publicación:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar publicación
exports.eliminarPublicacion = async (req, res) => {
    try {
        const eliminado = await ProductoRevision.findOneAndDelete({ idProducto: req.params.id });

        if (!eliminado) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        // También eliminar el producto asociado si existe
        await Producto.deleteOne({ idProducto: req.params.id });

        res.json({
            message: "🗑️ Publicación eliminada correctamente",
            publicacion: eliminado
        });
    } catch (error) {
        console.error("❌ Error al eliminar publicación:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};