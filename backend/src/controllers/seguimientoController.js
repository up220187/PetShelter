const Seguimiento = require('../models/Seguimiento');

/**
 * @swagger
 * /seguimientos:
 *   post:
 *     summary: Crear un nuevo seguimiento
 *     tags: [Seguimientos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seguimiento'
 *     responses:
 *       201:
 *         description: Seguimiento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seguimiento'
 *       400:
 *         description: Error en la solicitud
 */
exports.crearSeguimiento = async (req, res) => {
  try {
    const seguimiento = new Seguimiento(req.body);
    await seguimiento.save();
    res.status(201).json(seguimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /seguimientos:
 *   get:
 *     summary: Obtener todos los seguimientos
 *     tags: [Seguimientos]
 *     responses:
 *       200:
 *         description: Lista de seguimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Seguimiento'
 *       500:
 *         description: Error interno del servidor
 */
exports.obtenerSeguimientos = async (req, res) => {
  try {
    const seguimientos = await Seguimiento.find()
      .populate('segIdMascotas')
      .populate('segIdUsuario');
    res.json(seguimientos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener seguimientos' });
  }
};