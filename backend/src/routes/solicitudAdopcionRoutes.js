const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();
const solicitudController = require('../controllers/solicitudAdopcionController');

router.post('/', [
    authMiddleware,
    body('solIdUsuario').notEmpty().isMongoId().withMessage('El ID de usuario es obligatorio y debe ser un ObjectId válido'),
    body('solIdMascota').notEmpty().isMongoId().withMessage('El ID de la mascota es obligatorio y debe ser un ObjectId válido'),
    body('solFechaSolicitud').notEmpty().isISO8601().withMessage('La fecha de solicitud debe ser una fecha válida'),
    body('solEstado').notEmpty().withMessage('El estado de la solicitud es obligatorio'),
    body('solFechaVisitaProgramada').optional().isISO8601().withMessage('La fecha de visita programada debe ser una fecha válida'),
], validate, solicitudController.crearSolicitud);

router.get('/', [
    authMiddleware,
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
], validate, solicitudController.obtenerSolicitudes);

router.get('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido')
], validate, solicitudController.obtenerSolicitudPorId);

router.put('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'),
    body('solIdUsuario').notEmpty().isMongoId().withMessage('El ID de usuario es obligatorio y debe ser un ObjectId válido'),
    body('solIdMascota').notEmpty().isMongoId().withMessage('El ID de la mascota es obligatorio y debe ser un ObjectId válido'),
    body('solFechaSolicitud').notEmpty().isISO8601().withMessage('La fecha de solicitud debe ser una fecha válida'),
    body('solEstado').notEmpty().withMessage('El estado de la solicitud es obligatorio'),
    body('solFechaVisitaProgramada').optional().isISO8601().withMessage('La fecha de visita programada debe ser una fecha válida'),
], validate, solicitudController.actualizarSolicitud);

router.delete('/:id', [
    authMiddleware,
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido')
], validate, solicitudController.borrarSolicitud);

module.exports = router;