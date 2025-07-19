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
router.delete('/:id/rechazar', controller.rechazarProducto);

module.exports = router;

//esto ya valio 