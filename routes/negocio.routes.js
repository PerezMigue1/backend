const express = require("express");
const router = express.Router();
const negocioController = require("../controllers/negocio.controller");

// Rutas específicas PRIMERO (antes de las rutas con parámetros)

// Obtener negocios recomendados
router.get("/recomendados/todos", negocioController.obtenerNegociosRecomendados);

// Obtener negocios por categoría
router.get("/categoria/:categoria", negocioController.obtenerNegociosPorCategoria);

// Obtener negocios por estado
router.get("/estado/:estado", negocioController.obtenerNegociosPorEstado);

// Rutas generales

// Obtener todos los negocios
router.get("/", negocioController.obtenerNegocios);

// Obtener un negocio por ID
router.get("/:id", negocioController.obtenerNegocioPorId);

// Crear un nuevo negocio
router.post("/", negocioController.crearNegocio);

// Actualizar un negocio por ID
router.put("/:id", negocioController.actualizarNegocio);

// Eliminar un negocio por ID
router.delete("/:id", negocioController.eliminarNegocio);

module.exports = router;