const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();
const seguimientoController = require('../controllers/seguimientoController');

router.post('/', [
    authMiddleware,
    body('mascotaId').isMongoId().withMessage('El ID de la mascota debe ser un ID de MongoDB válido'),
    body('fechaSeguimiento').isISO8601().withMessage('La fecha de seguimiento debe ser una fecha válida'),
    body('observaciones').notEmpty().withMessage('Las observaciones son obligatorias')
], validate, seguimientoController.crearSeguimiento);

router.get('/', [
    authMiddleware,
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
], validate, seguimientoController.obtenerSeguimientos);

router.get('//:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido')
], validate, seguimientoController.obtenerSeguimientoPorId);

router.put('//:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'),
    body('mascotaId').isMongoId().withMessage('El ID de la mascota debe ser un ID de MongoDB válido'),
    body('fechaSeguimiento').isISO8601().withMessage('La fecha de seguimiento debe ser una fecha válida'),
    body('observaciones').notEmpty().withMessage('Las observaciones son obligatorias')
], validate, seguimientoController.actualizarSeguimiento);

router.delete('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido')
], validate, seguimientoController.borrarSeguimiento);

module.exports = router;