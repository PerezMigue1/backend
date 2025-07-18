const ProductoRevision = require("../models/productoRevision.model");
const Producto = require("../models/producto.model");
const Notificacion = require("../models/notificacion.model");

exports.aprobarProducto = async (req, res) => {
    console.log("👉 aprobarProducto llamado con ID:", req.params.id, " y usuario:", req.usuario);
    try {
        if (req.usuario.rol !== "admin") {
            console.log("❌ No autorizado, rol:", req.usuario.rol);
            return res.status(403).json({ mensaje: "No autorizado" });
        }

        const producto = await ProductoRevision.findById(req.params.id);
        console.log("📦 ProductoRevision:", producto);

        if (!producto) {
            console.log("❌ No se encontró el producto en revisión");
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        if (!producto.idArtesano) {
            console.log("❌ Falta idArtesano en producto:", producto);
            return res.status(400).json({ mensaje: "Producto sin artesano" });
        }

        const nuevoProducto = new Producto({
            idProducto: producto.idProducto,
            Nombre: producto.Nombre,
            Imagen: producto.Imagen,
            Precio: producto.Precio,
            Descripción: producto.Descripción,
            Dimensiones: producto.Dimensiones,
            Colores: producto.Colores,
            Etiquetas: producto.Etiquetas,
            idCategoria: producto.idCategoria,
            Origen: producto.Origen,
            Materiales: producto.Materiales,
            Técnica: producto.Técnica,
            Especificaciones: producto.Especificaciones,
            Disponibilidad: producto.Disponibilidad,
            Comentarios: producto.Comentarios,
            idArtesano: producto.idArtesano,
        });

        await nuevoProducto.save();
        console.log("✅ Producto guardado en colección productos:", nuevoProducto._id);

        const noti = await Notificacion.create({
            idUsuario: producto.idArtesano,
            tipo: "publicacion",
            producto: producto.Nombre,
            mensaje: `Tu producto "${producto.Nombre}" ha sido aprobado.`,
            estado: "pendiente",
            fecha: new Date(),
        });
        console.log("🔔 Notificación creada:", noti._id);

        await ProductoRevision.findByIdAndDelete(req.params.id);
        console.log("🗑 ProductoRevision eliminado");

        res.json({ mensaje: "Producto aprobado con éxito" });

    } catch (error) {
        console.error("🔥 ERROR en aprobarProducto:", error);
        res.status(500).json({ mensaje: "Error interno al aprobar" });
    }
};


exports.rechazarProducto = async (req, res) => {
    try {
        if (req.usuario.rol !== "admin") {
            return res.status(403).json({ mensaje: "No autorizado" });
        }

        console.log("ID recibido:", req.params.id);
        const producto = await ProductoRevision.findById(req.params.id);
        console.log("Producto encontrado:", producto);

        if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });


        await Notificacion.create({
            idArtesano: producto.idArtesano,
            mensaje: `Tu producto "${producto.Nombre}" ha sido rechazado por el administrador.`,
            estado: "no leído"
        });

        await ProductoRevision.findByIdAndDelete(req.params.id);

        res.status(200).json({ mensaje: "Producto rechazado y eliminado de la revisión" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al rechazar el producto" });
    }
};


// Obtener todos los productos pendientes
exports.obtenerTodos = async (req, res) => {
    try {
        const productos = await ProductoRevision.find();
        res.json(productos);
    } catch (error) {
        console.error("❌ Error al obtener productos pendientes:", error);
        res.status(500).json({ message: 'Error en el servidor' });
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
