const express = require('express');
const router = express.Router();
const contactoChef = require('../controllers/contactoChef.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');

router.get("/por-usuario/:idUsuario", contactoChef.obtenerChefPorUsuario);

router.post('/', upload.single('imagenPerfil'), contactoChef.crearContactoChef);
router.get('/', contactoChef.obtenerContactos);
router.get('/:id', contactoChef.obtenerContactoPorId);
router.put('/:id', contactoChef.actualizarContacto);
router.delete('/:id', contactoChef.eliminarContacto);

module.exports = router;