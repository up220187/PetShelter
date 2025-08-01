const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddlewares');
const estadoController = require('../controllers/estadoController');

const router = express.Router();

router.post('/', [
    authMiddleware,
    body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], validate, estadoController.crearEstado);

router.get('/', [
    authMiddleware,
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
], validate, estadoController.obtenerEstados);

module.exports = router;