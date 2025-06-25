const express = require("express");
const router = express.Router();
const preguntaController = require("../controllers/pregunta.controller");

// Obtener todas las preguntas
router.get("/", preguntaController.obtenerPreguntas);

// Crear nueva pregunta
router.post("/", preguntaController.crearPregunta);

// Eliminar pregunta por ID
router.delete("/:id", preguntaController.eliminarPregunta);

module.exports = router;
