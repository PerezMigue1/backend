const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoRevision.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');
const { verificarToken, permitirRoles } = require("../middlewares/auth.middleware");


router.post('/', upload.array('Imagen'), controller.crear);
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.put('/:id', controller.actualizarProducto);
router.delete('/:id', controller.eliminarProducto);

router.patch('/:id/aprobar', verificarToken, permitirRoles(['admin']), controller.aprobarProducto);
router.patch('/:id/rechazar', verificarToken, permitirRoles(['admin']), controller.rechazarProducto);

module.exports = router;
