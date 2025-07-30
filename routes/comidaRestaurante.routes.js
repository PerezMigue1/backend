const express = require("express");
const router = express.Router();
const controller = require("../controllers/comidaRestaurante.controller");
const upload = require("../middlewares/uploadCloudinary.middleware");
const { verificarToken, permitirRoles } = require("../middlewares/auth.middleware");

// Obtener todos
router.get("/", controller.obtenerTodos);
// Obtener platillos por idRestaurante (DEBE ir ANTES de /:id)
router.get("/por-restaurante/:idRestaurante", controller.obtenerPorRestaurante);
// Obtener por ID
router.get("/:id", controller.obtenerPorId);
// Crear nuevo platillo
router.post("/", verificarToken, upload.array("Imagenes"), controller.crear);
// Actualizar (cualquier usuario autenticado)
router.put("/:id", verificarToken, controller.actualizar);
// Eliminar (cualquier usuario autenticado)
router.delete("/:id", verificarToken, controller.eliminar);

module.exports = router; 