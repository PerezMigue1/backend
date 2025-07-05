const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedido.controller");
const { verificarToken, permitirRoles  } = require("../middlewares/auth.middleware");

router.post("/", verificarToken, permitirRoles("miembro", "admin"), pedidoController.crearPedido);
router.get("/", verificarToken, pedidoController.obtenerPedidos);
router.get("/:id", verificarToken, pedidoController.obtenerPedidoPorId);
router.put("/:id", verificarToken, pedidoController.actualizarPedido);
router.delete("/:id", verificarToken, pedidoController.eliminarPedido);

// Ruta exclusiva para administradores (ej. ver todos los pedidos del sistema)
router.get("/admin/todos", verificarToken, permitirRoles("admin"), pedidoController.obtenerTodosLosPedidosAdmin);

// Admin o miembro pueden ver sus propios pedidos
//router.get("/usuario", verificarToken, permitirRoles("miembro", "admin"), pedidoController.obtenerPedidosDelUsuario);


module.exports = router;
