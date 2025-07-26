const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estadoController');

router.post('/', estadoController.crearEstado);
router.get('/', estadoController.obtenerEstados);

module.exports = router;