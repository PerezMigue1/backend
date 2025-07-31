const express = require('express');
const router = express.Router();
const misionVisionController = require('../controllers/misionVision.controller');

// Importar middlewares
const { verificarToken} = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/public', misionVisionController.obtenerMisionVision);
router.get('/public/mision', misionVisionController.obtenerMision);
router.get('/public/vision', misionVisionController.obtenerVision);

// Rutas administrativas (requieren autenticación)
router.get('/admin', verificarToken, misionVisionController.obtenerTodasMisionVision);
router.get('/admin/:id', verificarToken, misionVisionController.obtenerMisionVisionPorId);
router.post('/admin', verificarToken, misionVisionController.crearMisionVision);
router.put('/admin/:id', verificarToken, misionVisionController.actualizarMisionVision);
router.delete('/admin/:id', verificarToken, misionVisionController.eliminarMisionVision);

module.exports = router; 