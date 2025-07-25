const express = require("express");
const router = express.Router();
const controller = require("../controllers/comidaRestaurante.controller");
const upload = require("../middlewares/uploadCloudinary.middleware");
const { verificarToken } = require("../middlewares/auth.middleware");

// Obtener todos
router.get("/", controller.obtenerTodos);
// Obtener por ID
router.get("/:id", controller.obtenerPorId);
// Crear nuevo platillo
router.post("/", verificarToken, upload.array("Imagenes"), controller.crear);
// Actualizar
router.put("/:id", verificarToken, controller.actualizar);
// Eliminar
router.delete("/:id", verificarToken, controller.eliminar);
// Obtener platillos por idRestaurante
router.get("/por-restaurante/:idRestaurante", controller.obtenerPorRestaurante);

module.exports = router; 