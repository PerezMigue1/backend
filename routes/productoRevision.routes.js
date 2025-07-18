const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoRevision.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');

const { verificarToken, permitirRoles } = require("../middlewares/auth.middleware"); // verifica token

// Aprobar producto (solo admin)
router.put("/aprobar/:id", verificarToken, permitirRoles("admin"),
    controller.aprobarProducto
);

// Rechazar producto (solo admin)
router.delete("/rechazar/:id", 
    verificarToken,
    permitirRoles("admin"),
    controller.rechazarProducto
);

// Obtener productos en revisión
router.get('/', 
    controller.obtenerTodo
);

router.post('/', upload.array('Imagen'), controller.crear);
router.get('/:id', controller.obtenerPorId);
router.put('/:id', controller.actualizarProducto);
router.delete('/:id', controller.eliminarProducto);

module.exports = router;
