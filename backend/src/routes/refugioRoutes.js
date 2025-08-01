const express = require('express');
const router = express.Router();
const refugioController = require('../controllers/refugioController');

router.post('/', refugioController.crearRefugio);
router.get('/', refugioController.obtenerRefugios);
router.put('/:id', refugioController.actualizarRefugio);
router.delete('/:id', refugioController.borrarRefugio);

module.exports = router;