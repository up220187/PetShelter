const express = require('express');
const router = express.Router();
const visitaController = require('../controllers/visitaController');

router.post('/', visitaController.crearVisita);
router.get('/', visitaController.obtenerVisitas);
router.put('/:id', visitaController.actualizarVisita);
router.delete('/:id', visitaController.borrarVisita);

module.exports = router;