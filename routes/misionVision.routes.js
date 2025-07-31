const express = require('express');
const router = express.Router();

// Importar controladores
const misionVisionController = require('../controllers/misionVision.controller');

// Importar middlewares
const authMiddleware = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/public', misionVisionController.obtenerMisionVision);
router.get('/public/mision', misionVisionController.obtenerMision);
router.get('/public/vision', misionVisionController.obtenerVision);

// Rutas administrativas (requieren autenticación y permisos de admin)
router.get('/admin', authMiddleware.verificarToken, authMiddleware.verificarAdmin, misionVisionController.obtenerTodasMisionVision);
router.get('/admin/:id', authMiddleware.verificarToken, authMiddleware.verificarAdmin, misionVisionController.obtenerMisionVisionPorId);
router.post('/admin', authMiddleware.verificarToken, authMiddleware.verificarAdmin, misionVisionController.crearMisionVision);
router.put('/admin/:id', authMiddleware.verificarToken, authMiddleware.verificarAdmin, misionVisionController.actualizarMisionVision);
router.delete('/admin/:id', authMiddleware.verificarToken, authMiddleware.verificarAdmin, misionVisionController.eliminarMisionVision);

module.exports = router; 