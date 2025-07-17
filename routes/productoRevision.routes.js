// routes/productoRevision.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoRevision.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');
const { verificarToken } = require('../middlewares/auth.middleware'); 
const adminMiddleware = require('../middlewares/admin.middleware');

// Rutas públicas
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);

// Rutas protegidas para artesanos
router.post('/', verificarToken, upload.array('Imagen'), controller.crear);

// Rutas de administración
router.put('/:id/aprobar', verificarToken, adminMiddleware, controller.aprobarPublicacion);
router.put('/:id/rechazar', verificarToken, adminMiddleware, controller.rechazarPublicacion);
router.put('/:id', verificarToken, adminMiddleware, controller.actualizarPublicacion);
router.delete('/:id', verificarToken, adminMiddleware, controller.eliminarPublicacion);

module.exports = router;