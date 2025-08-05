const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();
const refugioController = require('../controllers/refugioController');

router.post('/', [
    authMiddleware,
    body('refNombre').notEmpty().withMessage('El nombre del refugio es obligatorio'),
    body('refDireccion').notEmpty().withMessage('La dirección del refugio es obligatoria'),
    body('refDescripcion').notEmpty().withMessage('La descripción del refugio es obligatoria'),
    body('refHorarioAtencion').notEmpty().withMessage('El horario de atención es obligatorio'),
    body('refIdUsuario').notEmpty().isMongoId().withMessage('El ID de usuario es obligatorio y debe ser un ObjectId válido'),
], validate, refugioController.crearRefugio);

router.get('/', [
    authMiddleware,
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
], validate, refugioController.obtenerRefugios);

router.get('/usuario/:idUsuario', [
  authMiddleware,
  param('idUsuario').isMongoId().withMessage('El ID de usuario debe ser válido')
], validate, refugioController.obtenerRefugioPorUsuario);

router.put('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'),
    body('refNombre').notEmpty().withMessage('El nombre del refugio es obligatorio'),
    body('refDireccion').notEmpty().withMessage('La dirección del refugio es obligatoria'),
    body('refDescripcion').notEmpty().withMessage('La descripción del refugio es obligatoria'),
    body('refHorarioAtencion').notEmpty().withMessage('El horario de atención es obligatorio'),
    body('refIdUsuario').notEmpty().isMongoId().withMessage('El ID de usuario es obligatorio y debe ser un ObjectId válido'),
], validate, refugioController.actualizarRefugio);

router.delete('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido')
], validate, refugioController.borrarRefugio);

module.exports = router;