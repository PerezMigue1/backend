const ProductoRevision = require("../models/productoRevision.model");
const Producto = require("../models/producto.model");
const Notificacion = require("../models/notificacion.model");

const mongoose = require("mongoose");

exports.aprobarProducto = async (req, res) => {
    try {
        // Validación de usuario admin
        if (!req.usuario || req.usuario.rol !== "admin") {
            return res.status(403).json({ mensaje: "No autorizado: Se requiere rol de administrador" });
        }

        // Validación de ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: "ID de producto inválido" });
        }

        // Buscar el producto en revisión
        const productoRevision = await ProductoRevision.findById(req.params.id);
        if (!productoRevision) {
            return res.status(404).json({ mensaje: "Producto en revisión no encontrado" });
        }

        // Validar campos requeridos
        if (!productoRevision.idArtesano) {
            return res.status(400).json({ mensaje: "El producto no tiene asociado un artesano" });
        }

        // Crear el objeto para el producto aprobado
        const productoAprobado = new Producto({
            idProducto: productoRevision.idProducto,
            Nombre: productoRevision.Nombre,
            Imagen: productoRevision.Imagen,
            Precio: productoRevision.Precio,
            Descripción: productoRevision.Descripción,
            Dimensiones: productoRevision.Dimensiones,
            Colores: productoRevision.Colores,
            Etiquetas: productoRevision.Etiquetas,
            idCategoria: productoRevision.idCategoria,
            Origen: productoRevision.Origen,
            Materiales: productoRevision.Materiales,
            Técnica: productoRevision.Técnica,
            Especificaciones: productoRevision.Especificaciones,
            Disponibilidad: productoRevision.Disponibilidad,
            Comentarios: productoRevision.Comentarios,
            idArtesano: productoRevision.idArtesano,
            estado: "activo",
            fechaAprobacion: new Date()
        });

        // Guardar el producto aprobado
        await productoAprobado.save();

        // Actualizar el estado en la revisión
        productoRevision.estadoRevision = "aprobado";
        productoRevision.revisadoPor = req.usuario.id;
        productoRevision.fechaRevision = new Date();
        await productoRevision.save();

        // Crear notificación
        await Notificacion.create({
            idUsuario: productoRevision.idUsuario,
            tipo: "publicacion",
            producto: productoRevision.Nombre,
            mensaje: `Tu producto "${productoRevision.Nombre}" ha sido aprobado.`,
            estado: "no-leido",
            fecha: new Date()
        });

        res.status(200).json({ 
            mensaje: "Producto aprobado exitosamente",
            producto: productoAprobado
        });

    } catch (error) {
        console.error("Error en aprobarProducto:", error);
        res.status(500).json({ 
            mensaje: "Error interno al aprobar el producto",
            error: error.message 
        });
    }
};

exports.rechazarProducto = async (req, res) => {
    try {
        // Validación de usuario admin
        if (!req.usuario || req.usuario.rol !== "admin") {
            return res.status(403).json({ mensaje: "No autorizado: Se requiere rol de administrador" });
        }

        // Validación de ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: "ID de producto inválido" });
        }

        // Buscar y actualizar el producto en revisión
        const productoRechazado = await ProductoRevision.findByIdAndUpdate(
            req.params.id,
            {
                estadoRevision: "rechazado",
                revisadoPor: req.usuario.id,
                fechaRevision: new Date(),
                motivoRechazo: req.body.motivo || "No cumple con los requisitos"
            },
            { new: true }
        );

        if (!productoRechazado) {
            return res.status(404).json({ mensaje: "Producto en revisión no encontrado" });
        }

        // Crear notificación
        await Notificacion.create({
            idUsuario: productoRechazado.idUsuario,
            tipo: "publicacion",
            producto: productoRechazado.Nombre,
            mensaje: `Tu producto "${productoRechazado.Nombre}" ha sido rechazado. Motivo: ${productoRechazado.motivoRechazo}`,
            estado: "no-leido",
            fecha: new Date()
        });

        res.status(200).json({ 
            mensaje: "Producto rechazado exitosamente",
            producto: productoRechazado
        });

    } catch (error) {
        console.error("Error en rechazarProducto:", error);
        res.status(500).json({ 
            mensaje: "Error interno al rechazar el producto",
            error: error.message 
        });
    }
};

// Obtener todos los productos en revisión (solo para admin)
exports.obtenerTodos = async (req, res) => {
    try {
        const productos = await ProductoRevision.find({
            estadoRevision: "pendiente"
        }).sort({ fechaSolicitud: -1 });

        res.status(200).json({
            cantidad: productos.length,
            productos: productos,
            mensaje: "Productos en revisión obtenidos correctamente"
        });
    } catch (error) {
        console.error("Error al obtener productos en revisión:", error);
        res.status(500).json({ 
            mensaje: "Error interno al obtener productos",
            error: error.message 
        });
    }
};

// Obtener producto por ID personalizado
exports.obtenerPorId = async (req, res) => {
    try {
        const producto = await ProductoRevision.findOne({ idProducto: req.params.id });

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        console.error("❌ Error al obtener producto:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Crear nuevo producto pendiente
exports.crear = async (req, res) => {
    const datos = req.body;

    try {
        console.log("📥 Datos recibidos:", datos);
        console.log("📸 Archivos recibidos:", req.files);

        // Validar que venga idUsuario e idArtesano
        if (!datos.idUsuario || !datos.idArtesano) {
            return res.status(400).json({ message: "Faltan datos de usuario o artesano" });
        }

        // Verifica si vienen imágenes
        const imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                imagenes.push(file.path);
            }
        }

        // Generar idProducto automático y consecutivo
        const ultimo = await ProductoRevision.findOne().sort({ createdAt: -1 }).lean();
        let nuevoId = "P000001";
        if (ultimo && ultimo.idProducto) {
            const num = parseInt(ultimo.idProducto.slice(1)) + 1;
            nuevoId = "P" + num.toString().padStart(6, "0");
        }

        // Crear producto con datos completos
        const nuevoProducto = new ProductoRevision({
            idProducto: nuevoId,
            Nombre: datos.Nombre,
            Imagen: imagenes,
            Precio: datos.Precio,
            Descripción: datos.Descripción,
            Dimensiones: datos.Dimensiones,
            Colores: datos.Colores,
            Etiquetas: datos.Etiquetas,
            idCategoria: datos.idCategoria,
            Origen: datos.Origen,
            Materiales: datos.Materiales,
            Técnica: datos.Técnica,
            Especificaciones: datos.Especificaciones,
            Comentarios: datos.Comentarios,
            Disponibilidad: "En stock",
            idUsuario: datos.idUsuario,
            idArtesano: datos.idArtesano,
            estadoRevision: "pendiente",
            fechaSolicitud: new Date()
        });

        await nuevoProducto.save();

        res.status(201).json({
            message: "✅ Producto enviado correctamente para revisión",
            producto: nuevoProducto
        });

    } catch (error) {
        console.error("❌ Error al crear producto:", error.message);
        res.status(500).json({ message: "Error al crear producto", error: error.message });
    }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
    try {
        const productoActualizado = await ProductoRevision.findOneAndUpdate(
            { idProducto: req.params.id },
            req.body,
            { new: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({
            message: "✅ Producto actualizado correctamente",
            producto: productoActualizado
        });
    } catch (error) {
        console.error("❌ Error al actualizar producto:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
    try {
        const eliminado = await ProductoRevision.findOneAndDelete({ idProducto: req.params.id });

        if (!eliminado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({
            message: "🗑️ Producto eliminado correctamente",
            producto: eliminado
        });
    } catch (error) {
        console.error("❌ Error al eliminar producto:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
