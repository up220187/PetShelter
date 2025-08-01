const express = require('express');
const router = express.Router();
const tipoMascotaController = require('../controllers/tipoMascotaController');

router.post('/', tipoMascotaController.crearTipoMascota);
router.get('/', tipoMascotaController.obtenerTiposMascota);


module.exports = router;