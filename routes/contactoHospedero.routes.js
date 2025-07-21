const express = require('express');
const router = express.Router();
const controllerHospedaje = require('../controllers/contactoHospedero.controller');

router.post('/', controllerHospedaje.crearContactoHospedero);
router.get('/', controllerHospedaje.obtenerContactos);
router.get('/:id', controllerHospedaje.obtenerContactoPorId);
router.put('/:id', controllerHospedaje.actualizarContacto);
router.delete('/:id', controllerHospedaje.eliminarContacto);

module.exports = router;
