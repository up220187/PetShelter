const express = require('express');
const router = express.Router();
const seguimientoController = require('../controllers/seguimientoController');

router.post('/', seguimientoController.crearSeguimiento);
router.get('/', seguimientoController.obtenerSeguimientos);
router.get('/:id', seguimientoController.obtenerSeguimientoPorId);
router.put('/:id', seguimientoController.actualizarSeguimiento);
router.delete('/:id', seguimientoController.borrarSeguimiento);

module.exports = router;