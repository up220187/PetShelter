const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { body, param, query } = require('express-validator');
const { registerLimiter } = require('../middlewares/rateLimiter');

router.post('/login', [
    body('usuCorreo').isEmail().withMessage('El correo electrónico no es valido'),
    body('usuContraseña').isLength({ min: 5 }).withMessage('La contrasena debe tener al menos 5 caracteres')
], authController.login);

router.post('/register', [
    registerLimiter,
    body('usuCorreo').isEmail().withMessage('El correo electrónico no es valido'),
    body('usuContraseña').isLength({ min: 5 }).withMessage('La contrasena debe tener al menos 5 caracteres')
], authController.register);

router.post('/refresh-token', [
    body('refreshToken').notEmpty().withMessage('El token de refresco es requerido')
], authController.refreshToken);

module.exports = router;