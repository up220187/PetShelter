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

/**
 * @swagger
 * /seguimientos/{id}:
 *   put:
 *     summary: Actualizar un seguimiento existente
 *     tags: [Seguimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del seguimiento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seguimiento'
 *     responses:
 *       200:
 *         description: Seguimiento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seguimiento'
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Seguimiento no encontrado
 */
exports.actualizarSeguimiento = async (req, res) => {
  try {
    const seguimiento = await Seguimiento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!seguimiento) {
      return res.status(404).json({ error: 'Seguimiento no encontrado' });
    }
    res.json(seguimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


/**
 * @swagger
 * /seguimientos/{id}:
 *   get:
 *     summary: Obtener un seguimiento por ID
 *     tags: [Seguimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del seguimiento a obtener
 *     responses:
 *       200:
 *         description: Seguimiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seguimiento'
 *       404:
 *         description: Seguimiento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
exports.obtenerSeguimientoPorId = async (req, res) => {
  try {
    const seguimiento = await Seguimiento.findById(req.params.id)
      .populate('segIdMascotas')
      .populate('segIdUsuario');
    if (!seguimiento) {
      return res.status(404).json({ error: 'Seguimiento no encontrado' });
    }
    res.json(seguimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/**
 * @swagger
 * /seguimientos/{id}:
 *   delete:
 *     summary: Eliminar un seguimiento
 *     tags: [Seguimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del seguimiento a eliminar
 *     responses:
 *       200:
 *         description: Seguimiento eliminado exitosamente
 *       404:
 *         description: Seguimiento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
exports.borrarSeguimiento = async (req, res) => {
  try {
    const seguimiento = await Seguimiento.findByIdAndDelete(req.params.id);
    if (!seguimiento) {
      return res.status(404).json({ error: 'Seguimiento no encontrado' });
    }
    res.json({ message: 'Seguimiento eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};