const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacion.controller');

router.get('/', controller.obtenerTodas);
router.get('/usuario/:idUsuario', controller.obtenerPorUsuario);
router.get('/usuario/:idUsuario/no-leidas', controller.obtenerNoLeidas);
router.post('/', controller.crear);
router.put('/:id/leer', controller.marcarComoLeida);
router.delete('/:id', controller.eliminar);

module.exports = router;
