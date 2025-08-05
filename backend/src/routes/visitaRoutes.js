const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();
const visitaController = require('../controllers/visitaController');

router.post('/', [
    authMiddleware,
    body('visIdUsuario').notEmpty().isMongoId().withMessage('El ID de usuario es obligatorio y debe ser un ObjectId válido'),
    body('visIdMascota').notEmpty().isMongoId().withMessage('El ID de la mascota es obligatorio y debe ser un ObjectId válido'),
    body('visIdRefugio').notEmpty().isMongoId().withMessage('El ID del refugio es obligatorio y debe ser un ObjectId válido'),
    body('visFechaVisita').notEmpty().isISO8601().withMessage('La fecha de visita debe ser una fecha válida'),
    body('visHoraVisita').notEmpty().withMessage('La hora de visita es obligatoria'),
    body('visEstadoVisita').notEmpty().withMessage('El estado de la visita es obligatorio'),
], validate, visitaController.crearVisita);

router.get('/', [
    authMiddleware,
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
], validate, visitaController.obtenerVisitas);

router.post('/horarios-disponibles', [
    authMiddleware,
    body('visIdMascota').notEmpty().isMongoId().withMessage('El ID de la mascota es obligatorio y debe ser un ObjectId válido'),
    body('visFechaVisita').notEmpty().isISO8601().withMessage('La fecha de visita debe ser una fecha válida'),
    body('visitaActualId').optional().isMongoId().withMessage('El ID de la visita actual debe ser un ObjectId válido'),
], validate, visitaController.obtenerHorariosDisponibles);

router.put('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'),
    body('visIdUsuario').notEmpty().isMongoId().withMessage('El ID de usuario es obligatorio y debe ser un ObjectId válido'),
    body('visIdMascota').notEmpty().isMongoId().withMessage('El ID de la mascota es obligatorio y debe ser un ObjectId válido'),
    body('visIdRefugio').notEmpty().isMongoId().withMessage('El ID del refugio es obligatorio y debe ser un ObjectId válido'),
    body('visFechaVisita').notEmpty().isISO8601().withMessage('La fecha de visita debe ser una fecha válida'),
    body('visHoraVisita').notEmpty().withMessage('La hora de visita es obligatoria'),
    body('visEstadoVisita').notEmpty().withMessage('El estado de la visita es obligatorio'),
], validate, visitaController.actualizarVisita);
router.delete('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido')
], validate, visitaController.borrarVisita);

module.exports = router;