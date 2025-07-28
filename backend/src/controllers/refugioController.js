const Refugio = require('../models/Refugio');

/**
 * @swagger
 * /refugios:
 *   post:
 *     summary: Crear un nuevo refugio
 *     tags: [Refugios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Refugio'
 *     responses:
 *       201:
 *         description: Refugio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Refugio'
 *       400:
 *         description: Error en la solicitud
 */
exports.crearRefugio = async (req, res) => {
  try {
    const refugio = new Refugio(req.body);
    await refugio.save();
    res.status(201).json(refugio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /refugios:
 *   get:
 *     summary: Obtener todos los refugios
 *     tags: [Refugios]
 *     responses:
 *       200:
 *         description: Lista de refugios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Refugio'
 *       500:
 *         description: Error interno del servidor
 */
exports.obtenerRefugios = async (req, res) => {
  try {
    const refugios = await Refugio.find().populate('refIdUsuario');
    res.json(refugios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener refugios' });
  }
};