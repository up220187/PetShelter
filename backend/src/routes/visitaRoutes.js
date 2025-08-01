const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();
const visitaController = require('../controllers/visitaController');

router.post('/', [
    authMiddleware,
    body('mascotaId').isMongoId().withMessage('El ID de la mascota debe ser un ID de MongoDB válido'),
    body('fechaVisita').isISO8601().withMessage('La fecha de visita debe ser una fecha válida'),
    body('observaciones').notEmpty().withMessage('Las observaciones son obligatorias')
], validate, visitaController.crearVisita);

router.get('/', [
    authMiddleware,
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
], validate, visitaController.obtenerVisitas);

router.put('/:id'[
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'),
    body('mascotaId').isMongoId().withMessage('El ID de la mascota debe ser un ID de MongoDB válido'),
    body('fechaVisita').isISO8601().withMessage('La fecha de visita debe ser una fecha válida'),
    body('observaciones').notEmpty().withMessage('Las observaciones son obligatorias')
], validate, visitaController.actualizarVisita);
router.delete('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido')
], validate, visitaController.borrarVisita);

module.exports = router;