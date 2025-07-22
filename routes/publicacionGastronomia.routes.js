const express = require('express');
const router = express.Router();
const controllerPubliGastronomia = require('../controllers/publicacionGastronomia.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');

// Crear publicación con carga de imágenes
router.post('/', upload.array('imagen'), controllerPubliGastronomia.crearPublicacion);

// Obtener todas las publicaciones
router.get('/', controllerPubliGastronomia.obtenerPublicaciones);

// Obtener publicación por ID
router.get('/:id', controllerPubliGastronomia.obtenerPublicacionPorId);

// Actualizar publicación por ID
router.put('/:id', controllerPubliGastronomia.actualizarPublicacion);

// Eliminar publicación por ID
router.delete('/:id', controllerPubliGastronomia.eliminarPublicacion);

module.exports = router;
