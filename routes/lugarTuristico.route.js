const express = require('express');
const router = express.Router();
const lugarController = require('../controllers/lugarTuristico.controller');

router.post('/', lugarController.crearLugar);
router.get('/', lugarController.obtenerLugares);
router.get('/:id', lugarController.obtenerLugarPorId);
router.put('/:id', lugarController.actualizarLugar);
router.delete('/:id', lugarController.eliminarLugar);

module.exports = router;
