const express = require('express');
const router = express.Router();
const controllerHospedaje = require('../controllers/contactoHospedero.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');

router.post('/', upload.single('imagenPerfil'), controllerHospedaje.crearContactoHospedero);
router.get('/', controllerHospedaje.obtenerContactos);
router.get('/:id', controllerHospedaje.obtenerContactoPorId);
router.put('/:id', controllerHospedaje.actualizarContacto);
router.delete('/:id', controllerHospedaje.eliminarContacto);

module.exports = router;
