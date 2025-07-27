const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudAdopcionController');

router.post('/', solicitudController.crearSolicitud);
router.get('/', solicitudController.obtenerSolicitudes);
router.put('/:id', solicitudController.actualizarSolicitud);

module.exports = router;