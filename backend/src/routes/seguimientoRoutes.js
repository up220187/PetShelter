const express = require('express');
const router = express.Router();
const seguimientoController = require('../controllers/seguimientoController');

router.post('/', seguimientoController.crearSeguimiento);
router.get('/', seguimientoController.obtenerSeguimientos);

module.exports = router;