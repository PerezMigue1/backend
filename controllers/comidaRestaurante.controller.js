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

// Obtener platillos por idRestaurante
exports.obtenerPorRestaurante = async (req, res) => {
    try {
        console.log('🔍 Buscando platillos para restaurante:', req.params.idRestaurante);
        
        // Primero, obtener todos los platillos para debuggear
        const todosLosPlatillos = await ComidaRestaurante.find();
        console.log('🔍 Todos los platillos en la BD:', todosLosPlatillos.length);
        todosLosPlatillos.forEach((p, i) => {
            console.log(`🔍 Platillo ${i + 1}:`, {
                nombre: p.Nombre,
                idRestaurante: p.idRestaurante,
                estado: p.estadoRevision
            });
        });
        
        const platillos = await ComidaRestaurante.find({ idRestaurante: req.params.idRestaurante });
        console.log('🔍 Platillos encontrados para', req.params.idRestaurante, ':', platillos.length);
        
        res.json(platillos);
    } catch (error) {
        console.error("❌ Error al obtener platillos por restaurante:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Crear nuevo platillo
exports.crear = async (req, res) => {
    try {
        console.log('🔍 Controlador crear platillo ejecutándose');
        console.log('🔍 Headers recibidos:', req.headers);
        console.log('🔍 Body recibido:', req.body);
        console.log('🔍 Files recibidos:', req.files);
        
        const datos = req.body;
        let imagenes = [];
        if (req.files && Array.isArray(req.files)) {
            imagenes = req.files.map(file => file.path);
        } else if (req.body.Imagenes) {
            imagenes = Array.isArray(req.body.Imagenes) ? req.body.Imagenes : [req.body.Imagenes];
        }
        datos.Imagenes = imagenes;
        
        console.log('🔍 Datos finales a guardar:', datos);
        
        const nuevaComida = new ComidaRestaurante(datos);
        await nuevaComida.save();
        
        console.log('🔍 Platillo guardado exitosamente:', nuevaComida);
        
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
        console.log('🔍 Actualizando platillo:', req.params.id, 'con datos:', req.body);
        const actualizado = await ComidaRestaurante.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!actualizado) {
            return res.status(404).json({ message: 'Platillo no encontrado' });
        }
        console.log('🔍 Platillo actualizado:', actualizado);
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