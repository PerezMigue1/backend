const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/restaurante.controller');

// CRUD
router.get('/', restauranteController.obtenerRestaurantes);
router.get('/:id', restauranteController.obtenerRestaurantePorId);
router.post('/', restauranteController.crearRestaurante);
router.put('/:id', restauranteController.actualizarRestaurante);
router.delete('/:id', restauranteController.eliminarRestaurante);

module.exports = router; 