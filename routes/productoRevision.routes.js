const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoRevision.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');

const auth = require("../middlewares/auth.middleware"); // verifica token

router.put("/aprobar/:id", auth.verificarRol("admin"), controller.aprobarProducto);
router.delete("/rechazar/:id", auth.verificarRol("admin"), controller.rechazarProducto);

router.post('/', upload.array('Imagen'), controller.crear);
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.put('/:id', controller.actualizarProducto);
router.delete('/:id', controller.eliminarProducto);

module.exports = router;
