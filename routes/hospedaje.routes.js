const express = require('express');
const router = express.Router();
const controllerHospedaje = require('../controllers/hospedaje.controller');

router.post('/', controllerHospedaje.crearHospedaje);
router.get('/', controllerHospedaje.obtenerHospedajes);
router.get('/:id', controllerHospedaje.obtenerHospedajePorId);
router.put('/:id', controllerHospedaje.actualizarHospedaje);
router.delete('/:id', controllerHospedaje.eliminarHospedaje);

module.exports = router;

