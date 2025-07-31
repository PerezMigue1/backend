const express = require('express');
const router = express.Router();
const {
    obtenerMisionVision,
    obtenerMision,
    obtenerVision,
    crearMisionVision,
    actualizarMisionVision,
    eliminarMisionVision,
    obtenerMisionVisionPorId,
    obtenerTodasMisionVision
} = require('../controllers/misionVision.controller');

const { verificarToken, verificarAdmin } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/public', obtenerMisionVision);
router.get('/public/mision', obtenerMision);
router.get('/public/vision', obtenerVision);

// Rutas administrativas (requieren autenticación y permisos de admin)
router.get('/admin', verificarToken, verificarAdmin, obtenerTodasMisionVision);
router.get('/admin/:id', verificarToken, verificarAdmin, obtenerMisionVisionPorId);
router.post('/admin', verificarToken, verificarAdmin, crearMisionVision);
router.put('/admin/:id', verificarToken, verificarAdmin, actualizarMisionVision);
router.delete('/admin/:id', verificarToken, verificarAdmin, eliminarMisionVision);

module.exports = router; 