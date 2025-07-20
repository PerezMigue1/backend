const ProductoRevision = require("../models/productoRevision.model");
const Notificacion = require("../models/notificacion.model");
const Producto = require("../models/producto.model");

// Función para generar ID consecutivo
const generarIdConsecutivo = async () => {
    try {
        // Buscar el último ID en ambas colecciones
        const [ultimoRevision, ultimoProducto] = await Promise.all([
            ProductoRevision.findOne().sort({ idProducto: -1 }).lean(),
            Producto.findOne().sort({ idProducto: -1 }).lean()
        ]);

        let ultimoId = "P000000";
        
        // Comparar y obtener el ID más alto
        if (ultimoRevision && ultimoRevision.idProducto) {
            ultimoId = ultimoRevision.idProducto;
        }
        
        if (ultimoProducto && ultimoProducto.idProducto) {
            if (parseInt(ultimoProducto.idProducto.slice(1)) > parseInt(ultimoId.slice(1))) {
                ultimoId = ultimoProducto.idProducto;
            }
        }

        // Generar el siguiente ID
        const numeroActual = parseInt(ultimoId.slice(1));
        const siguienteNumero = numeroActual + 1;
        const nuevoId = "P" + siguienteNumero.toString().padStart(6, "0");
        
        console.log(`🔢 ID generado: ${nuevoId} (anterior: ${ultimoId})`);
        return nuevoId;
    } catch (error) {
        console.error("❌ Error al generar ID:", error);
        // Fallback: generar ID con timestamp
        const timestamp = Date.now();
        return "P" + timestamp.toString().slice(-6);
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
        console.log("📝 Descripción recibida:", datos.Descripción);
        console.log("🎨 Técnica recibida:", datos.Técnica);

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

        // Validar que al menos haya una imagen
        if (imagenes.length === 0) {
            return res.status(400).json({ message: "Se requiere al menos una imagen del producto" });
        }
        
        // Generar idProducto automático y consecutivo
        const nuevoId = await generarIdConsecutivo();

        // Preparar datos del producto con manejo explícito de campos con acentos
        const datosProducto = {
            idProducto: nuevoId,
            Nombre: datos.Nombre || '',
            Imagen: imagenes,
            Precio: parseFloat(datos.Precio) || 0,
            Descripción: datos.Descripción || datos.Descripcion || '',
            Dimensiones: datos.Dimensiones || '',
            Colores: datos.Colores || '',
            Etiquetas: datos.Etiquetas || '',
            idCategoria: datos.idCategoria,
            Origen: datos.Origen || '',
            Materiales: datos.Materiales || '',
            Técnica: datos.Técnica || datos.Tecnica || '',
            Especificaciones: datos.Especificaciones || '',
            Comentarios: datos.Comentarios || '',
            Disponibilidad: "En stock",
            idUsuario: datos.idUsuario,
            idArtesano: datos.idArtesano,
            estadoRevision: "pendiente",
            fechaSolicitud: new Date()
        };

        console.log("📋 Datos del producto a guardar:", {
            Nombre: datosProducto.Nombre,
            Descripción: datosProducto.Descripción,
            Técnica: datosProducto.Técnica,
            Precio: datosProducto.Precio
        });

        // Crear producto con datos completos
        const nuevoProducto = new ProductoRevision(datosProducto);

        await nuevoProducto.save();

        console.log("✅ Producto guardado exitosamente");
        console.log("📝 Descripción guardada:", nuevoProducto.Descripción);
        console.log("🎨 Técnica guardada:", nuevoProducto.Técnica);

        res.status(201).json({
            message: "✅ Producto enviado correctamente para revisión",
            producto: nuevoProducto
        });

    } catch (error) {
        console.error("❌ Error al crear producto:", error.message);
        console.error("❌ Error completo:", error);
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

// Aprobar producto pendiente
exports.aprobarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { revisadoPor, comentarios } = req.body;

        console.log("🔍 Aprobando producto con ID:", id);
        console.log("📝 Datos recibidos:", req.body);

        // Validación más flexible - si no viene revisadoPor, usar un valor por defecto
        const revisor = revisadoPor || 'admin';

        const producto = await ProductoRevision.findOne({ idProducto: id });

        if (!producto) {
            console.log("❌ Producto no encontrado con ID:", id);
            return res.status(404).json({ 
                message: 'Producto no encontrado',
                error: `No se encontró producto con ID: ${id}`
            });
        }

        console.log("✅ Producto encontrado:", producto.idProducto, "Estado:", producto.estadoRevision);

        // Verificar que el producto esté pendiente
        if (producto.estadoRevision !== 'pendiente') {
            return res.status(400).json({ 
                message: 'El producto ya no está pendiente de revisión',
                error: `Estado actual: ${producto.estadoRevision}`
            });
        }

        // Actualizar el producto en revisión
        const actualizado = await ProductoRevision.findOneAndUpdate(
            { idProducto: id },
            {
                estadoRevision: "aprobado",
                revisadoPor: revisor,
                fechaRevision: new Date(),
                Comentarios: comentarios || ''
            },
            { new: true }
        );

        // Crear notificación para el artesano
        const notificacion = new Notificacion({
            idUsuario: producto.idArtesano,
            tipo: 'publicacion',
            producto: producto.Nombre,
            estado: 'aprobado',
            mensaje: `Tu producto "${producto.Nombre}" ha sido aprobado y ya está disponible en la tienda.`,
            fecha: new Date()
        });
        await notificacion.save();

        // Mover el producto aprobado a la colección de productos
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
            Comentarios: comentarios || '',
            idArtesano: producto.idArtesano
        });
        await nuevoProducto.save();

        console.log("✅ Producto aprobado exitosamente y movido a productos");

        res.json({
            message: "✅ Producto aprobado correctamente",
            producto: actualizado,
            notificacion: notificacion
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
        const { revisadoPor, motivoRechazo, comentarios } = req.body;

        console.log("🔍 Rechazando producto con ID:", id);
        console.log("📝 Datos recibidos:", req.body);

        // Validaciones más flexibles
        const revisor = revisadoPor || 'admin';
        const motivo = motivoRechazo || 'No especificado';

        const producto = await ProductoRevision.findOne({ idProducto: id });

        if (!producto) {
            console.log("❌ Producto no encontrado con ID:", id);
            return res.status(404).json({ 
                message: 'Producto no encontrado',
                error: `No se encontró producto con ID: ${id}`
            });
        }

        console.log("✅ Producto encontrado:", producto.idProducto, "Estado:", producto.estadoRevision);

        // Verificar que el producto esté pendiente
        if (producto.estadoRevision !== 'pendiente') {
            return res.status(400).json({ 
                message: 'El producto ya no está pendiente de revisión',
                error: `Estado actual: ${producto.estadoRevision}`
            });
        }

        // Actualizar el producto en revisión
        const actualizado = await ProductoRevision.findOneAndUpdate(
            { idProducto: id },
            {
                estadoRevision: "rechazado",
                revisadoPor: revisor,
                motivoRechazo: motivo,
                fechaRevision: new Date(),
                Comentarios: comentarios || ''
            },
            { new: true }
        );

        // Crear notificación para el artesano
        const notificacion = new Notificacion({
            idUsuario: producto.idArtesano,
            tipo: 'publicacion',
            producto: producto.Nombre,
            estado: 'rechazado',
            mensaje: `Tu producto "${producto.Nombre}" ha sido rechazado. Motivo: ${motivo}`,
            Motivo: motivo,
            fecha: new Date()
        });
        await notificacion.save();

        console.log("✅ Producto rechazado exitosamente");

        res.json({
            message: "❌ Producto rechazado correctamente",
            producto: actualizado,
            notificacion: notificacion
        });

    } catch (error) {
        console.error("❌ Error al rechazar producto:", error);
        res.status(500).json({ 
            message: 'Error en el servidor',
            error: error.message 
        });
    }
};

// Obtener productos por estado de revisión
exports.obtenerPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        
        // Validar que el estado sea válido
        const estadosValidos = ['pendiente', 'aprobado', 'rechazado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ 
                message: 'Estado no válido',
                error: `Estados válidos: ${estadosValidos.join(', ')}`
            });
        }

        const productos = await ProductoRevision.find({ estadoRevision: estado }).sort({ fechaSolicitud: -1 });
        
        res.json({
            message: `Productos ${estado}s obtenidos correctamente`,
            productos: productos,
            total: productos.length
        });

    } catch (error) {
        console.error("❌ Error al obtener productos por estado:", error);
        res.status(500).json({ 
            message: 'Error en el servidor',
            error: error.message 
        });
    }
};

// Obtener estadísticas de productos por estado
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const [pendientes, aprobados, rechazados] = await Promise.all([
            ProductoRevision.countDocuments({ estadoRevision: 'pendiente' }),
            ProductoRevision.countDocuments({ estadoRevision: 'aprobado' }),
            ProductoRevision.countDocuments({ estadoRevision: 'rechazado' })
        ]);

        const total = pendientes + aprobados + rechazados;

        res.json({
            message: "Estadísticas obtenidas correctamente",
            estadisticas: {
                total,
                pendientes,
                aprobados,
                rechazados
            }
        });

    } catch (error) {
        console.error("❌ Error al obtener estadísticas:", error);
        res.status(500).json({ 
            message: 'Error en el servidor',
            error: error.message 
        });
    }
};