const express = require('express');
const router = express.Router();
const hospedajeController = require('../controllers/hospedaje.controller');

router.get('/', hospedajeController.obtenerHospedajes);
router.get('/:id', hospedajeController.obtenerHospedajePorId);
router.post('/', hospedajeController.crearHospedaje);
router.put('/:id', hospedajeController.actualizarHospedaje);
router.delete('/:id', hospedajeController.eliminarHospedaje);

module.exports = router;
