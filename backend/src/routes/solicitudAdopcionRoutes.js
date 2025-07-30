const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const solicitudController = require('../controllers/solicitudAdopcionController');

router.post(
  '/',
  [
    body('usuario').notEmpty().withMessage('Usuario es obligatorio'),
    body('mascota').notEmpty().withMessage('Mascota es obligatoria'),
    body('fecha').isISO8601().withMessage('Fecha inválida'),
    body('estado').notEmpty().withMessage('Estado requerido'),
  ],
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  solicitudController.crearSolicitud
);

router.get('/', solicitudController.obtenerSolicitudes);

router.put(
  '/:id',
  [
    body('estado').notEmpty().withMessage('Estado requerido'),
  ],
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  solicitudController.actualizarSolicitud
);

module.exports = router;
