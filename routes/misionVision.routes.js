const express = require('express');
const router = express.Router();
const misionVisionController = require('../controllers/misionVision.controller');

// Importar middlewares
const authMiddleware = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/public', misionVisionController.obtenerMisionVision);
router.get('/public/mision', misionVisionController.obtenerMision);
router.get('/public/vision', misionVisionController.obtenerVision);

// Rutas administrativas (requieren autenticación)
router.get('/admin', authMiddleware.verificarToken, misionVisionController.obtenerTodasMisionVision);
router.get('/admin/:id', authMiddleware.verificarToken, misionVisionController.obtenerMisionVisionPorId);
router.post('/admin', authMiddleware.verificarToken, misionVisionController.crearMisionVision);
router.put('/admin/:id', authMiddleware.verificarToken, misionVisionController.actualizarMisionVision);
router.delete('/admin/:id', authMiddleware.verificarToken, misionVisionController.eliminarMisionVision);

module.exports = router; 