const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const refugioController = require('../controllers/refugioController');

router.post(
  '/',
  [
    body('nombre').notEmpty().withMessage('Nombre obligatorio'),
    body('direccion').notEmpty().withMessage('Dirección obligatoria'),
    body('telefono').notEmpty().withMessage('Teléfono obligatorio'),
  ],
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  refugioController.crearRefugio
);

router.get('/', refugioController.obtenerRefugios);

module.exports = router;
