const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoRevision.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');


router.post('/', upload.array('Imagen'), controller.crear);
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.put('/:id', controller.actualizarProducto);
router.delete('/:id', controller.eliminarProducto);

router.put('/:id/aprobar', controller.aprobarProducto);
router.put('/:id/rechazar', controller.rechazarProducto);

router.get('/estado/:estado', controller.obtenerPorEstado);
router.get('/estadisticas/totales', controller.obtenerEstadisticas);

module.exports = router;

//esto ya valio 