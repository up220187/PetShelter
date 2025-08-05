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



exports.obtenerRefugioPorUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const refugio = await Refugio.findOne({ refIdUsuario: idUsuario });

    if (!refugio) {
      return res.status(404).json({ mensaje: "Refugio no encontrado para este usuario." });
    }

    res.json(refugio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener refugio." });
  }
};

/**
 * @swagger
 * /refugios/{id}:
 *   put:
 *     summary: Actualizar un refugio existente
 *     tags: [Refugios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del refugio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Refugio'
 *     responses:
 *       200:
 *         description: Refugio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Refugio'
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Refugio no encontrado
 */
exports.actualizarRefugio = async (req, res) => {
  try {
    const refugio = await Refugio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!refugio) {
      return res.status(404).json({ error: 'Refugio no encontrado' });
    }
    res.json(refugio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /refugios/{id}:
 *   delete:
 *     summary: Borrar un refugio existente
 *     tags: [Refugios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del refugio a borrar
 *     responses:
 *       200:
 *         description: Refugio borrado exitosamente
 *       404:
 *         description: Refugio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
exports.borrarRefugio = async (req, res) => {
  try {
    const refugio = await Refugio.findByIdAndDelete(req.params.id);
    if (!refugio) {
      return res.status(404).json({ error: 'Refugio no encontrado' });
    }
    res.json({ message: 'Refugio borrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};
/**
 * @swagger
 * /seguimientos/{id}:
 *   put:
 *     summary: Actualizar un refugio por ID
 *     tags: [Refugios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del refugio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Refugio'
 *     responses:
 *       200:
 *         description: Refugio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Refugio'
 *       400:
 *         description: Error en la solicitud de actualización
 *       404:
 *         description: Refugio no encontrado al actualizar el refugio
 */
exports.actualizarRefugio = async (req, res) => {
  try {
    const refugio = await Refugio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!refugio) {
      return res.status(404).json({ error: 'Refugio no encontrado' });
    }
    res.json(refugio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

