const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post(
  '/',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('Correo inválido'),
    body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres en contraseña'),
    body('rol').isIn(['adoptante', 'refugio', 'admin']).withMessage('Rol no válido'),
  ],
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  usuarioController.crearUsuario
);

router.post(
  '/login',
  [
    body('correo').isEmail().withMessage('Correo inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida'),
  ],
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
  usuarioController.loginUsuario
);

router.get('/', usuarioController.obtenerUsuarios);

module.exports = router;
