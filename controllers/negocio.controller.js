const Negocio = require("../models/negocio.model"); 
 
// ✅ Obtener todos los negocios 
exports.obtenerNegocios = async (req, res) => { 
    try { 
        const negocios = await Negocio.find(); 
        res.json(negocios); 
    } catch (error) { 
        console.error("❌ Error al obtener negocios:", error); 
        res.status(500).json({ message: "Error en el servidor" }); 
    } 
}; 
 
// ✅ Obtener un negocio por ID 
exports.obtenerNegocioPorId = async (req, res) => { 
    try { 
        const negocio = await Negocio.findById(req.params.id); 
        if (!negocio) { 
            return res.status(404).json({ message: "Negocio no encontrado" }); 
        } 
        res.json(negocio); 
    } catch (error) { 
        console.error("❌ Error al obtener negocio:", error); 
        res.status(500).json({ message: "Error en el servidor" }); 
    } 
}; 
 
// ✅ Crear nuevo negocio 
exports.crearNegocio = async (req, res) => { 
    try { 
        const nuevoNegocio = new Negocio(req.body); 
        await nuevoNegocio.save(); 
        res.status(201).json({ 
            message: "Negocio creado correctamente", 
            negocio: nuevoNegocio 
        }); 
    } catch (error) { 
        console.error("❌ Error al crear negocio:", error); 
        res.status(500).json({ message: "Error interno del servidor" }); 
    } 
}; 
 
// ✅ Actualizar negocio por ID 
exports.actualizarNegocio = async (req, res) => { 
    try { 
        const negocioActualizado = await Negocio.findByIdAndUpdate( 
            req.params.id, 
            req.body, 
            { new: true } 
        ); 
 
        if (!negocioActualizado) { 
            return res.status(404).json({ message: "Negocio no encontrado" }); 
        } 
 
        res.json({ 
            message: "Negocio actualizado correctamente", 
            negocio: negocioActualizado 
        }); 
    } catch (error) { 
        console.error("❌ Error al actualizar negocio:", error); 
        res.status(500).json({ message: "Error en el servidor" }); 
    } 
}; 
 
// ✅ Eliminar negocio por ID 
exports.eliminarNegocio = async (req, res) => { 
    try { 
        const negocioEliminado = await Negocio.findByIdAndDelete(req.params.id); 
 
        if (!negocioEliminado) { 
            return res.status(404).json({ message: "Negocio no encontrado" }); 
        } 
 
        res.json({ 
            message: "Negocio eliminado correctamente", 
            negocio: negocioEliminado 
        }); 
    } catch (error) { 
        console.error("❌ Error al eliminar negocio:", error); 
        res.status(500).json({ message: "Error en el servidor" }); 
    } 
};

// ✅ Obtener negocios por categoría
exports.obtenerNegociosPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const negocios = await Negocio.find({ Categoria: categoria });
        res.json(negocios);
    } catch (error) {
        console.error("❌ Error al obtener negocios por categoría:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Obtener negocios por ubicación (estado)
exports.obtenerNegociosPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const negocios = await Negocio.find({ "Ubicacion.Estado": estado });
        res.json(negocios);
    } catch (error) {
        console.error("❌ Error al obtener negocios por estado:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Obtener negocios recomendados
exports.obtenerNegociosRecomendados = async (req, res) => {
    try {
        const negociosRecomendados = await Negocio.find({ Recomendado: true });
        res.json(negociosRecomendados);
    } catch (error) {
        console.error("❌ Error al obtener negocios recomendados:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};