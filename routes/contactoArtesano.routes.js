const express = require("express");
const router = express.Router();
const contactoController = require("../controllers/contactoArtesano.controller");
const upload = require("../middlewares/uploadCloudinary.middleware");
const { verificarToken } = require("../middlewares/auth.middleware");

router.get("/por-usuario/:idUsuario", contactoController.obtenerArtesanoPorUsuario);

router.post("/", verificarToken, upload.single("imagenPerfil"), contactoController.crearContacto);

router.get("/", contactoController.obtenerContactos);
router.get("/:id", contactoController.obtenerContactoPorId);
router.put("/:id", contactoController.actualizarContacto);
router.delete("/:id", contactoController.eliminarContacto);

module.exports = router;
