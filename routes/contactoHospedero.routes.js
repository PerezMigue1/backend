const express = require('express');
const router = express.Router();
const contactoHospedaje = require('../controllers/contactoHospedero.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');

router.get("/por-usuario/:idUsuario", contactoHospedaje.obtenerHospederoPorUsuario);

router.post('/', upload.single('imagenPerfil'), contactoHospedaje.crearContactoHospedero);
router.get('/', contactoHospedaje.obtenerContactos);
router.get('/:id', contactoHospedaje.obtenerContactoPorId);
router.put('/:id', contactoHospedaje.actualizarContacto);
router.delete('/:id', contactoHospedaje.eliminarContacto);

module.exports = router;
