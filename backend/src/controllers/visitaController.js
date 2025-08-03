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
    const { visIdMascota, visFechaVisita, visHoraVisita } = req.body;
    // Validar que el ID es un ObjectId válido
    if (!visIdMascota || !visIdMascota.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID de mascota inválido.' });
    }
    const Mascota = require('../models/Mascota');
    const mascota = await Mascota.findById(visIdMascota);
    if (!mascota) {
      return res.status(404).json({ message: 'Mascota no encontrada.' });
    }
    if (mascota.masEstado !== 'Disponible') {
      return res.status(400).json({ message: 'Solo se puede agendar visita si la mascota está disponible.' });
    }
    // Validar que no exista otra visita para la misma mascota en la misma fecha y hora
    const visitaExistente = await Visita.findOne({
      visIdMascota,
      visFechaVisita,
      visHoraVisita
    });
    if (visitaExistente) {
      return res.status(400).json({ message: 'Ya existe una visita agendada para esta mascota en esa fecha y hora.' });
    }
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
    res.json(visitas);borrarVisita
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
    // Si el body incluye visIdMascota, validar que sea igual al actual
    if (req.body.visIdMascota) {
      const visitaActual = await Visita.findById(req.params.id);
      if (!visitaActual) {
        return res.status(404).json({ error: 'Visita no encontrada' });
      }
      if (String(req.body.visIdMascota) !== String(visitaActual.visIdMascota)) {
        return res.status(400).json({ error: 'No se puede modificar la mascota de la visita.' });
      }
    }
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