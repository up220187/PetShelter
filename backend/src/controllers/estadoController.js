const Estado = require('../models/Estado');

/**
 * @swagger
 * /estados:
 *   post:
 *     summary: Crear un nuevo estado
 *     tags: [Estados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estado'
 *     responses:
 *       201:
 *         description: Estado creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estado'
 *       400:
 *         description: Error en la solicitud
 */
exports.crearEstado = async (req, res) => {
  try {
    const estado = new Estado(req.body);
    await estado.save();
    res.status(201).json(estado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /estados:
 *   get:
 *     summary: Obtener todos los estados
 *     tags: [Estados]
 *     responses:
 *       200:
 *         description: Lista de estados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Estado'
 *       500:
 *         description: Error interno del servidor
 */
exports.obtenerEstados = async (req, res) => {
  try {
    const estados = await Estado.find();
    res.json(estados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estados' });
  }
};