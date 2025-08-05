const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/', [
    body('usuCorreo').isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('usuContraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], validate, usuarioController.crearUsuario);

router.get('/', [
    authMiddleware,
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
], validate, usuarioController.obtenerUsuarios);


router.get('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido')
], validate, usuarioController.obtenerUsuarioPorId);

router.put('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'),
    body('usuCorreo').isEmail().withMessage('Debe ser un correo electrónico válido')
], validate, usuarioController.actualizarUsuario);

router.delete('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido')
], validate, usuarioController.eliminarUsuario);


module.exports = router;