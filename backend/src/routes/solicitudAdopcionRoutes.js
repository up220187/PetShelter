const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudAdopcionController');

router.post('/', solicitudController.crearSolicitud);
router.get('/', solicitudController.obtenerSolicitudes);
router.get('/:id', solicitudController.obtenerSolicitudPorId);
router.put('/:id', solicitudController.actualizarSolicitud);
router.delete('/:id', solicitudController.borrarSolicitud);

module.exports = router;