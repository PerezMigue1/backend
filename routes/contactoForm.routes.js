const express = require("express");
const router = express.Router();
const contactoController = require("../controllers/contactoForm.controller");

router.get("/", contactoController.obtenerMensajes);
router.post("/", contactoController.crearMensaje);
router.get("/:id", contactoController.obtenerMensajePorId); // opcional
router.delete("/:id", contactoController.eliminarMensaje); // opcional

module.exports = router;
