const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');

router.post(
  '/',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('edad').isNumeric().withMessage('Edad debe ser numérica'),
    body('tipoMascota').notEmpty().withMessage('Tipo de mascota es obligatorio'),
    body('estado').notEmpty().withMessage('Estado es obligatorio'),
    body('descripcion').optional().isString(),
  ],
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  mascotaController.crearMascota
);

router.get('/', mascotaController.obtenerMascotas);
router.get('/:id', mascotaController.obtenerMascotaPorId);

module.exports = router;
