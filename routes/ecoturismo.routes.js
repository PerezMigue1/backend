const express = require('express');
const router = express.Router();
const ecoturismoController = require('../controllers/ecoturismo.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/uploadCloudinary.middleware');

// ===== RUTAS PÚBLICAS =====

// Obtener todos los destinos de ecoturismo
router.get('/public', ecoturismoController.obtenerEcoturismoPublico);

// Obtener destino por ID
router.get('/public/:id', ecoturismoController.obtenerEcoturismoPorId);

// Obtener destinos por categoría
router.get('/public/categoria/:categoria', ecoturismoController.obtenerEcoturismoPorCategoria);

// Obtener destinos destacados
router.get('/public/destacados', ecoturismoController.obtenerEcoturismoDestacado);

// Buscar destinos
router.get('/public/buscar', ecoturismoController.buscarEcoturismo);

// ===== RUTAS ADMINISTRATIVAS =====

// Obtener todos los destinos (admin)
router.get('/admin', verificarToken, ecoturismoController.obtenerTodosEcoturismo);

// Crear nuevo destino
router.post('/admin', verificarToken, upload.array('imagenes'), ecoturismoController.crearEcoturismo);

// Actualizar destino
router.put('/admin/:id', verificarToken, upload.array('imagenes'), ecoturismoController.actualizarEcoturismo);

// Eliminar destino
router.delete('/admin/:id', verificarToken, ecoturismoController.eliminarEcoturismo);

// Obtener estadísticas
router.get('/admin/estadisticas', verificarToken, ecoturismoController.obtenerEstadisticasEcoturismo);

module.exports = router; 