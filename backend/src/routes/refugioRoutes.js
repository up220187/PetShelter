const express = require('express');
const router = express.Router();
const refugioController = require('../controllers/refugioController');

router.post('/', refugioController.crearRefugio);
router.get('/', refugioController.obtenerRefugios);

module.exports = router;