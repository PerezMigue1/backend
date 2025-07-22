const express = require('express');
const router = express.Router();
const controllerPubliHospedaje = require('../controllers/publicacionHospedaje.controller');
const upload = require('../middlewares/uploadCloudinary.middleware');

router.post('/', upload.array('Imagenes'), controllerPubliHospedaje.crearPublicacion);
router.get('/', controllerPubliHospedaje.obtenerPublicaciones);
router.get('/:id', controllerPubliHospedaje.obtenerPublicacionPorId);
router.put('/:id', controllerPubliHospedaje.actualizarPublicacion);
router.delete('/:id', controllerPubliHospedaje.eliminarPublicacion);

module.exports = router;
