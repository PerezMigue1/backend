const express = require("express");
const router = express.Router();
const controller = require("../controllers/publicacionRestaurante.controller");
const upload = require("../middlewares/uploadCloudinary.middleware");

// Obtener todas
router.get("/", controller.obtenerTodas);
// Obtener por ID
router.get("/:id", controller.obtenerPorId);
// Crear nueva publicación
router.post("/", upload.array("Imagenes"), controller.crear);
// Actualizar
router.put("/:id", controller.actualizar);
// Eliminar
router.delete("/:id", controller.eliminar);
// Aprobar
router.put("/:id/aprobar", controller.aprobar);
// Rechazar
router.put("/:id/rechazar", controller.rechazar);
// Por estado
router.get("/estado/:estado", controller.obtenerPorEstado);
// Estadísticas
router.get('/estadisticas/totales', controller.obtenerEstadisticas);
// Obtener detalle de publicación con platillos
router.get("/:id/detalle-con-platillos", controller.obtenerDetalleConPlatillos);
// Aprobar platillo
router.post("/platillo/:id/aprobar", controller.aprobarPlatillo);
// Rechazar platillo
router.post("/platillo/:id/rechazar", controller.rechazarPlatillo);

module.exports = router; 