const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const { verificarToken, permitirRoles } = require("../middlewares/auth.middleware");

// CRUD + recuperación de contraseña
router.post("/", usuarioController.crearUsuario);
router.post("/login", usuarioController.loginUsuario);
router.post("/pregunta-secreta", usuarioController.obtenerPreguntaRecuperacion);
router.post("/verificar-respuesta", usuarioController.validarRespuestaRecuperacion);
router.post("/cambiar-password", usuarioController.cambiarPassword);
router.put("/:id", usuarioController.actualizarUsuario);
router.delete("/:id", usuarioController.eliminarUsuario);

// Obtener perfil de usuario por ID
router.get("/:id/perfil", usuarioController.obtenerPerfilUsuario);

// Actualizar perfil de usuario por ID
router.put("/:id/perfil", usuarioController.actualizarPerfilUsuario);

router.put("/:id/cambiar-password", usuarioController.cambiarPasswordDesdePerfil);

module.exports = router;
