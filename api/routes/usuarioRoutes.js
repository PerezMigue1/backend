const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// Obtener todos los usuarios
router.get("/", usuarioController.obtenerUsuarios);

// Crear nuevo usuario
router.post("/", usuarioController.crearUsuario);

// Login de usuario
router.post("/login", usuarioController.loginUsuario);

// Paso 1: Obtener pregunta de seguridad por email (para recuperación)
router.post("/pregunta-secreta", usuarioController.obtenerPreguntaRecuperacion);

// Paso 2: Validar respuesta de seguridad (para recuperación)
router.post("/verificar-respuesta", usuarioController.validarRespuestaRecuperacion);

// Paso 3: Cambiar contraseña (con token temporal válido)
router.post("/cambiar-password", usuarioController.cambiarPassword);

// Actualizar información de usuario
router.put("/:id", usuarioController.actualizarUsuario);

// Eliminar usuario
router.delete("/:id", usuarioController.eliminarUsuario);

module.exports = router;