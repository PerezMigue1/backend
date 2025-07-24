const express = require('express');
const router = express.Router();
const controllerFestividades = require('../controllers/festividades.controller');

router.post('/', controllerFestividades.crearFestividad);
router.get('/', controllerFestividades.obtenerFestividades);
router.get('/:id', controllerFestividades.obtenerFestividadPorId);
router.put('/:id', controllerFestividades.actualizarFestividad);
router.delete('/:id', controllerFestividades.eliminarFestividad);

module.exports = router; 