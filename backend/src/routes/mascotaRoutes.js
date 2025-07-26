const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');

router.post('/', mascotaController.crearMascota);
router.get('/', mascotaController.obtenerMascotas);
router.get('/:id', mascotaController.obtenerMascotaPorId);

module.exports = router;