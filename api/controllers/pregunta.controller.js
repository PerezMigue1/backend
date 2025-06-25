const PreguntaRecuperacion = require("../models/pregunta.model");

// ✅ Obtener todas las preguntas
exports.obtenerPreguntas = async (req, res) => {
    try {
        const preguntas = await PreguntaRecuperacion.find();
        res.status(200).json(preguntas);
    } catch (error) {
        console.error("❌ Error al obtener preguntas:", error);
        res.status(500).json({ message: "Error al obtener preguntas" });
    }
};

// ✅ Crear nueva pregunta
exports.crearPregunta = async (req, res) => {
    try {
        const { pregunta } = req.body;

        if (!pregunta) {
            return res.status(400).json({ message: "La pregunta es obligatoria" });
        }

        const yaExiste = await PreguntaRecuperacion.findOne({ pregunta });
        if (yaExiste) {
            return res.status(400).json({ message: "La pregunta ya existe" });
        }

        const nuevaPregunta = new PreguntaRecuperacion({ pregunta });
        await nuevaPregunta.save();

        res.status(201).json({
            message: "Pregunta registrada correctamente",
            pregunta: nuevaPregunta
        });
    } catch (error) {
        console.error("❌ Error al crear pregunta:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Eliminar pregunta por ID
exports.eliminarPregunta = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminada = await PreguntaRecuperacion.findByIdAndDelete(id);

        if (!eliminada) {
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }

        res.json({
            message: "Pregunta eliminada correctamente",
            pregunta: eliminada
        });
    } catch (error) {
        console.error("❌ Error al eliminar pregunta:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
