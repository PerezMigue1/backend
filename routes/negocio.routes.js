const express = require("express");
const router = express.Router();
const negocioController = require("../controllers/negocio.controller");
const { verificarToken } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/uploadCloudinary.middleware");

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

// ===== RUTAS PÚBLICAS =====
// Crear un nuevo negocio (público)
router.post("/", negocioController.crearNegocio);

// ===== RUTAS ADMINISTRATIVAS =====
// Crear un nuevo negocio (admin)
router.post("/admin", verificarToken, upload.array('Imagenes'), negocioController.crearNegocio);

// Actualizar un negocio por ID (admin)
router.put("/admin/:id", verificarToken, upload.array('Imagenes'), negocioController.actualizarNegocio);

// Eliminar un negocio por ID (admin)
router.delete("/admin/:id", verificarToken, negocioController.eliminarNegocio);

module.exports = router;