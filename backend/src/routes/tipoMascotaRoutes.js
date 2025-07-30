const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const tipoMascotaController = require('../controllers/tipoMascotaController');

router.post(
  '/',
  [
    body('nombre').notEmpty().withMessage('Nombre del tipo es requerido'),
  ],
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  tipoMascotaController.crearTipoMascota
);

router.get('/', tipoMascotaController.obtenerTiposMascota);

module.exports = router;
