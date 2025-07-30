const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const estadoController = require('../controllers/estadoController');

router.post(
  '/',
  [
    body('nombre').notEmpty().withMessage('Nombre de estado requerido'),
  ],
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  estadoController.crearEstado
);

router.get('/', estadoController.obtenerEstados);

module.exports = router;
