const express = require('express');
const router = express.Router();
const politicasController = require('../controllers/politicas.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/public', politicasController.obtenerPoliticasPublicas);
router.get('/public/:tipo', politicasController.obtenerPoliticaPorTipo);

// Rutas administrativas (requieren autenticación)
router.get('/admin', verificarToken, politicasController.obtenerTodasPoliticas);
router.post('/admin', verificarToken, politicasController.crearPolitica);
router.put('/admin/:id', verificarToken, politicasController.actualizarPolitica);
router.delete('/admin/:id', verificarToken, politicasController.eliminarPolitica);

module.exports = router; 