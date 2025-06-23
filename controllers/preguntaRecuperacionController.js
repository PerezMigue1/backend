const PreguntaRecuperacion = require("../models/PreguntaRecuperacion");

// Obtener todas las preguntas
exports.obtenerPreguntas = async (req, res) => {
    try {
        const preguntas = await PreguntaRecuperacion.find();
        res.status(200).json(preguntas);
    } catch (error) {
        console.error("❌ Error al obtener preguntas:", error);
        res.status(500).json({ message: "Error al obtener preguntas" });
    }
};

// Agregar nueva pregunta (opcional, para administrador)
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

        const nueva = new PreguntaRecuperacion({ pregunta });
        await nueva.save();

        res.status(201).json({ message: "Pregunta registrada correctamente", pregunta: nueva });
    } catch (error) {
        console.error("❌ Error al crear pregunta:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Eliminar una pregunta (opcional)
exports.eliminarPregunta = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminada = await PreguntaRecuperacion.findByIdAndDelete(id);

        if (!eliminada) {
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }

        res.json({ message: "Pregunta eliminada correctamente", pregunta: eliminada });
    } catch (error) {
        console.error("❌ Error al eliminar pregunta:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
