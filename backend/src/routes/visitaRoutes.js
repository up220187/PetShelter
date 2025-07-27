const express = require('express');
const router = express.Router();
const visitaController = require('../controllers/visitaController');

router.post('/', visitaController.crearVisita);
router.get('/', visitaController.obtenerVisitas);

module.exports = router;