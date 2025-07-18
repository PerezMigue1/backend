const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoRevision.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');

const auth = require("../middlewares/auth.middleware"); // verifica token
const { check } = require('express-validator');

// Validación de ID
const validarId = [
    check('id').isMongoId().withMessage('ID de producto inválido')
];

// Aprobar producto (solo admin)
router.put("/aprobar/:id", 
    auth.verificarToken,
    auth.verificarRol("admin"),
    validarId,
    controller.aprobarProducto
);

// Rechazar producto (solo admin)
router.delete("/rechazar/:id", 
    auth.verificarToken,
    auth.verificarRol("admin"),
    validarId,
    controller.rechazarProducto
);

// Obtener productos en revisión (solo admin)
router.get('/', 
    auth.verificarToken,
    auth.verificarRol("admin"),
    controller.obtenerTodos
);

router.post('/', upload.array('Imagen'), controller.crear);
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.put('/:id', controller.actualizarProducto);
router.delete('/:id', controller.eliminarProducto);

module.exports = router;
