const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();
const refugioController = require('../controllers/refugioController');

router.post('/' [
    authMiddleware,
    body('nombre').notEmpty().withMessage('El nombre del refugio es obligatorio'),
    body('direccion').notEmpty().withMessage('La dirección del refugio es obligatoria'),
    body('telefono').notEmpty().withMessage('El teléfono del refugio es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido')
], validate, refugioController.crearRefugio);

router.get('/', [
    authMiddleware,
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
], validate, refugioController.obtenerRefugios);

router.put('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'),
    body('nombre').notEmpty().withMessage('El nombre del refugio es obligatorio'),
    body('direccion').notEmpty().withMessage('La dirección del refugio es obligatoria'),
    body('telefono').notEmpty().withMessage('El teléfono del refugio es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido')
], validate, refugioController.actualizarRefugio);

router.delete('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido')
], validate, refugioController.borrarRefugio);

module.exports = router;