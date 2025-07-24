const ComidaRestaurante = require("../models/comidaRestaurante.model");

// Obtener todos los platillos
exports.obtenerTodos = async (req, res) => {
    try {
        const comidas = await ComidaRestaurante.find();
        res.json(comidas);
    } catch (error) {
        console.error("❌ Error al obtener comidas:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener platillo por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const comida = await ComidaRestaurante.findById(req.params.id);
        if (!comida) {
            return res.status(404).json({ message: 'Platillo no encontrado' });
        }
        res.json(comida);
    } catch (error) {
        console.error("❌ Error al obtener platillo:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Crear nuevo platillo
exports.crear = async (req, res) => {
    try {
        const datos = req.body;
        let imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            imagenes = req.files.map(file => file.path);
        } else if (req.body.Imagenes) {
            imagenes = Array.isArray(req.body.Imagenes) ? req.body.Imagenes : [req.body.Imagenes];
        }
        datos.Imagenes = imagenes;
        const nuevaComida = new ComidaRestaurante(datos);
        await nuevaComida.save();
        res.status(201).json({
            message: "✅ Platillo creado correctamente",
            comida: nuevaComida
        });
    } catch (error) {
        console.error("❌ Error al crear platillo:", error.message);
        res.status(500).json({ message: "Error al crear platillo", error: error.message });
    }
};

// Actualizar platillo
exports.actualizar = async (req, res) => {
    try {
        const actualizado = await ComidaRestaurante.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!actualizado) {
            return res.status(404).json({ message: 'Platillo no encontrado' });
        }
        res.json({
            message: "✅ Platillo actualizado correctamente",
            comida: actualizado
        });
    } catch (error) {
        console.error("❌ Error al actualizar platillo:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar platillo
exports.eliminar = async (req, res) => {
    try {
        const eliminado = await ComidaRestaurante.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ message: 'Platillo no encontrado' });
        }
        res.json({
            message: "🗑️ Platillo eliminado correctamente",
            comida: eliminado
        });
    } catch (error) {
        console.error("❌ Error al eliminar platillo:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}; 