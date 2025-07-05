const express = require("express");
const router = express.Router();
const categoriaProductoController = require("../controllers/categoriaProducto.controller");

router.get("/", categoriaProductoController.obtenerCategorias);
router.get("/:id", categoriaProductoController.obtenerCategoriaPorId);
router.post("/", categoriaProductoController.crearCategoria);
router.put("/:id", categoriaProductoController.actualizarCategoria);
router.delete("/:id", categoriaProductoController.eliminarCategoria);

module.exports = router;
