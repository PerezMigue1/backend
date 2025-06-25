const express = require("express");
const router = express.Router();
const preguntaController = require("../controllers/preguntaRecuperacionController");

// Obtener todas las preguntas
router.get("/", preguntaController.obtenerPreguntas);

// Crear nueva pregunta
router.post("/", preguntaController.crearPregunta);

// Eliminar pregunta (opcional)
router.delete("/:id", preguntaController.eliminarPregunta);

module.exports = router;
