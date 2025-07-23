const express = require('express');
const router = express.Router();
const controllerPubliGastronomia = require('../controllers/publicacionGastronomia.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');

// Crear publicación con carga de imágenes
router.post('/', upload.array('imagen'), controllerPubliGastronomia.crearPublicacion);

// Obtener todas las publicaciones
router.get('/', controllerPubliGastronomia.obtenerPublicaciones);

// Obtener publicación por ID (MongoDB _id)
router.get('/:id', controllerPubliGastronomia.obtenerPorId);

// Actualizar publicación por ID
router.put('/:id', controllerPubliGastronomia.actualizarPublicacion);

// Eliminar publicación por ID
router.delete('/:id', controllerPubliGastronomia.eliminarPublicacion);

// Aprobar publicación
router.put('/:id/aprobar', controllerPubliGastronomia.aprobarPublicacion);

// Rechazar publicación
router.put('/:id/rechazar', controllerPubliGastronomia.rechazarPublicacion);

// Obtener publicaciones por estado
router.get('/estado/:estado', controllerPubliGastronomia.obtenerPorEstado);

// Obtener estadísticas
router.get('/estadisticas/totales', controllerPubliGastronomia.obtenerEstadisticas);

module.exports = router;
