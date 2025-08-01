const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body, param, query } = require('express-validator');
const { registerLimiter } = require('../middlewares/rateLimiter');

router.post('/login, '[
    body('usuCorreo').isEmail().withMessage('El correo electrónico no es valido'),
    body('usuContraseña').isLength({ min: 5 }).withMessage('La contrasena debe tener al menos 5 caracteres')
], authController.login);

router.post('/register', [
    registerLimiter,
    body('usuNombre').notEmpty().isLength(50).withMessage('El nombre es requerido'),
    body('usuCorreo').isEmail().withMessage('El correo electrónico no es valido'),
    body('usuContraseña').isLength({ min: 5 }).withMessage('La contrasena debe tener al menos 5 caracteres')
], authController.register);

module.exports = router;