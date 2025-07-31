const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faq.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/public', faqController.obtenerFAQsPublicas);
router.get('/public/:categoria', faqController.obtenerFAQPorCategoria);

// Rutas administrativas (requieren autenticación)
router.get('/admin', verificarToken, faqController.obtenerTodasFAQs);
router.post('/admin', verificarToken, faqController.crearFAQ);
router.put('/admin/:id', verificarToken, faqController.actualizarFAQ);
router.delete('/admin/:id', verificarToken, faqController.eliminarFAQ);

module.exports = router; 