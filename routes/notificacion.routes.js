const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacion.controller');

router.get('/', controller.obtenerTodas);
router.get('/:idUsuario', controller.obtenerPorUsuario);
router.post('/', controller.crear);
router.delete('/:id', controller.eliminar);

module.exports = router;
