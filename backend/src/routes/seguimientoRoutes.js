const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const seguimientoController = require('../controllers/seguimientoController');

router.post(
  '/',
  [
    body('solicitud').notEmpty().withMessage('Solicitud requerida'),
    body('fecha').isISO8601().withMessage('Fecha inválida'),
    body('descripcion').notEmpty().withMessage('Descripción requerida'),
  ],
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  seguimientoController.crearSeguimiento
);

router.get('/', seguimientoController.obtenerSeguimientos);

module.exports = router;
