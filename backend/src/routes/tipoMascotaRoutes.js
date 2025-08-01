const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();
const tipoMascotaController = require('../controllers/tipoMascotaController');

router.post('/'[
    authMiddleware,
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('descripcion').optional().isString().withMessage('La descripción debe ser una cadena de texto')
], validate, tipoMascotaController.crearTipoMascota);

router.get('/', [
    authMiddleware,
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
], validate, tipoMascotaController.obtenerTiposMascota);

module.exports = router;