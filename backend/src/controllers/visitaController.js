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

/**
 * @swagger
 * /visitas/{id}:
 *   put:
 *     summary: Actualizar una visita existente
 *     tags: [Visitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la visita a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Visita'
 *     responses:
 *       200:
 *         description: Visita actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visita'
 *       400:
 *         description: Error en los datos proporcionados
 *       404:
 *         description: Visita no encontrada
 */
exports.actualizarVisita = async (req, res) => {
  try {
    const visita = await Visita.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!visita) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }
    res.json(visita);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /visitas/{id}:
 *   delete:
 *     summary: Eliminar una visita
 *     tags: [Visitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la visita a eliminar
 *     responses:
 *       200:
 *         description: Visita eliminada exitosamente
 *       404:
 *         description: Visita no encontrada
 */
exports.borrarVisita = async (req, res) => {
  try {
    const visita = await Visita.findByIdAndDelete(req.params.id);
    if (!visita) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }
    res.json({ message: 'Visita eliminada exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};