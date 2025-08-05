const Mascota = require('../models/Mascota');

/**
 * @swagger
 * /mascotas:
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Mascotas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mascota'
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       400:
 *         description: Error en la solicitud
 */
exports.crearMascota = async (req, res) => {
  try {
    const mascota = new Mascota(req.body);
    await mascota.save();
    res.status(201).json(mascota);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /mascotas:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Mascotas]
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mascota'
 *       500:
 *         description: Error interno del servidor
 */
exports.obtenerMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find();
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mascotas' });
  }
};

/**
 * @swagger
 * /mascotas/{id}:
 *   get:
 *     summary: Obtener una mascota por ID
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error interno del servidor
 */
exports.obtenerMascotaPorId = async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id);
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
    res.json(mascota);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mascota' });
  }
};


/**
 * @swagger
 * /mascotas/{id}:
 *   delete:
 *     summary: Eliminar una mascota por ID
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error interno del servidor
 */
exports.borrarMascotaPorId = async (req, res) => {
  try {
    const mascota = await Mascota.findByIdAndDelete(req.params.id);
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
    res.json({ message: 'Mascota eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar mascota' });
  }
};

/**
 * @swagger
 * /mascotas/{id}:
 *   put:
 *     summary: Actualizar una mascota por ID
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mascota'
 *     responses:
 *       200:
 *         description: Mascota actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       404:
 *         description: Mascota no encontrada
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
exports.actualizarMascotaPorId = async (req, res) => {
  try {
    const mascota = await Mascota.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
    res.json(mascota);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};