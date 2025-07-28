const Visita = require('../models/Visita');

/**
 * @swagger
 * /visitas:
 *   post:
 *     summary: Crear una nueva visita
 *     tags: [Visitas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Visita'
 *     responses:
 *       201:
 *         description: Visita creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visita'
 *       400:
 *         description: Error en los datos proporcionados
 */
exports.crearVisita = async (req, res) => {
  try {
    const visita = new Visita(req.body);
    await visita.save();
    res.status(201).json(visita);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /visitas:
 *   get:
 *     summary: Obtener todas las visitas
 *     tags: [Visitas]
 *     responses:
 *       200:
 *         description: Lista de visitas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Visita'
 *       500:
 *         description: Error al obtener visitas
 */
exports.obtenerVisitas = async (req, res) => {
  try {
    const visitas = await Visita.find()
      .populate('visIdUsuario')
      .populate('visIdMascota')
      .populate('visIdRefugio');
    res.json(visitas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener visitas' });
  }
};