const express = require('express');
const router = express.Router();
const gastronomiaController = require('../controllers/gastronomia.controller');

router.get('/', gastronomiaController.obtenerGastronomia);
router.get('/:id', gastronomiaController.obtenerGastronomiaPorId );
router.post('/', gastronomiaController.crearGastronomia);
router.put('/:id', gastronomiaController.actualizarGastronomia);
router.delete('/:id', gastronomiaController.eliminarGastronomia);

module.exports = router;