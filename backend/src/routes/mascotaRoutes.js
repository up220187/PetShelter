const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');

router.post('/', mascotaController.crearMascota);
router.get('/', mascotaController.obtenerMascotas);
router.get('/:id', mascotaController.obtenerMascotaPorId);
router.put('/:id', mascotaController.actualizarMascotaPorId);
router.delete('/:id', mascotaController.borrarMascotaPorId);

module.exports = router;