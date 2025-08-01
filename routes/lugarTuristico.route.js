const express = require('express');
const router = express.Router();
const lugarController = require('../controllers/lugarTuristico.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/uploadCloudinary.middleware');

// ===== RUTAS PÚBLICAS =====
router.get('/', lugarController.obtenerLugares);
router.get('/:id', lugarController.obtenerLugarPorId);

// ===== RUTAS ADMINISTRATIVAS =====
router.post('/admin', verificarToken, upload.array('Imagen'), lugarController.crearLugar);
router.put('/admin/:id', verificarToken, upload.array('Imagen'), lugarController.actualizarLugar);
router.delete('/admin/:id', verificarToken, lugarController.eliminarLugar);

module.exports = router;
