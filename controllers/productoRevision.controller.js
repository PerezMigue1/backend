const ProductoRevision = require("../models/productoRevision.model");

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


// En tu controlador (productoRevision.controller.js)

// Aprobar producto pendiente
exports.aprobarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { revisadoPor } = req.body;

        // Validación más robusta
        if (!revisadoPor) {
            return res.status(400).json({ 
                message: "Se requiere el ID del administrador que revisa",
                error: "Falta el campo 'revisadoPor' en el cuerpo de la solicitud"
            });
        }

        const producto = await ProductoRevision.findOne({ idProducto: id });

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Actualizar el producto
        const actualizado = await ProductoRevision.findOneAndUpdate(
            { idProducto: id },
            {
                estadoRevision: "aprobado",
                revisadoPor: revisadoPor,
                fechaRevision: new Date()
            },
            { new: true }
        );

        res.json({
            message: "✅ Producto aprobado correctamente",
            producto: actualizado
        });

    } catch (error) {
        console.error("❌ Error al aprobar producto:", error);
        res.status(500).json({ 
            message: 'Error en el servidor',
            error: error.message 
        });
    }
};

// Rechazar producto pendiente
exports.rechazarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { revisadoPor, motivoRechazo } = req.body;

        // Validaciones mejoradas
        if (!revisadoPor || !motivoRechazo) {
            return res.status(400).json({ 
                message: "Se requiere el ID del revisor y el motivo de rechazo",
                error: revisadoPor ? "Falta el campo 'motivoRechazo'" : "Falta el campo 'revisadoPor'"
            });
        }

        const producto = await ProductoRevision.findOne({ idProducto: id });

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Actualizar el producto
        const actualizado = await ProductoRevision.findOneAndUpdate(
            { idProducto: id },
            {
                estadoRevision: "rechazado",
                revisadoPor: revisadoPor,
                motivoRechazo: motivoRechazo,
                fechaRevision: new Date()
            },
            { new: true }
        );

        res.json({
            message: "❌ Producto rechazado correctamente",
            producto: actualizado
        });

    } catch (error) {
        console.error("❌ Error al rechazar producto:", error);
        res.status(500).json({ 
            message: 'Error en el servidor',
            error: error.message 
        });
    }
};