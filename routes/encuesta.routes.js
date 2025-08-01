const express = require('express');
const router = express.Router();
const encuestaController = require('../controllers/encuesta.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// ===== RUTAS PÚBLICAS =====
router.get('/public', encuestaController.obtenerEncuestasPublicas);
router.get('/public/:id', encuestaController.obtenerEncuestaPorId);
router.post('/public/respuesta', encuestaController.enviarRespuesta);

// ===== RUTAS ADMINISTRATIVAS =====
router.get('/', verificarToken, encuestaController.obtenerTodasEncuestas);
router.post('/', verificarToken, encuestaController.crearEncuesta);
router.put('/:id', verificarToken, encuestaController.actualizarEncuesta);
router.delete('/:id', verificarToken, encuestaController.eliminarEncuesta);
router.get('/:id/estadisticas', verificarToken, encuestaController.obtenerEstadisticasEncuesta);
router.get('/:id/respuestas', verificarToken, encuestaController.obtenerRespuestasEncuesta);

module.exports = router; 