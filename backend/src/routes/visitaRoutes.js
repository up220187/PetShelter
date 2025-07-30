const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const visitaController = require('../controllers/visitaController');

router.post(
  '/',
  [
    body('usuario').notEmpty().withMessage('Usuario es obligatorio'),
    body('mascota').notEmpty().withMessage('Mascota es obligatoria'),
    body('fecha').isISO8601().withMessage('Fecha inválida'),
  ],
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  visitaController.crearVisita
);

router.get('/', visitaController.obtenerVisitas);

module.exports = router;
