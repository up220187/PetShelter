const SolicitudAdopcion = require('../models/SolicitudAdopcion');

/**
 * @swagger
 * /solicitudes:
 *   post:
 *     summary: Crear una nueva solicitud de adopción
 *     tags: [SolicitudesAdopcion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SolicitudAdopcion'
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
exports.crearSolicitud = async (req, res) => {
  try {
    const { solIdMascota } = req.body;
    // Validar que el ID es un ObjectId válido
    if (!solIdMascota || !solIdMascota.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID de mascota inválido.' });
    }
    const Mascota = require('../models/Mascota');
    const mascota = await Mascota.findById(solIdMascota);
    if (!mascota) {
      return res.status(404).json({ message: 'Mascota no encontrada.' });
    }
    if (mascota.masEstado !== 'Disponible') {
      return res.status(400).json({ message: 'Solo se puede solicitar adopción si la mascota está disponible.' });
    }
    const solicitud = new SolicitudAdopcion(req.body);
    await solicitud.save();
    res.status(201).json(solicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /solicitudes:
 *   get:
 *     summary: Obtener todas las solicitudes de adopción
 *     tags: [SolicitudesAdopcion]
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SolicitudAdopcion'
 *       500:
 *         description: Error del servidor
 */
exports.obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await SolicitudAdopcion.find()
      .populate('solIdUsuario')
      .populate('solIdMascota');
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
};

/**
 * @swagger
 * /solicitudes/{id}:
 *   get:
 *     summary: Obtener una solicitud de adopción por ID
 *     tags: [SolicitudesAdopcion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SolicitudAdopcion'
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error del servidor
 */
exports.obtenerSolicitudPorId = async (req, res) => {
  try {
    const solicitud = await SolicitudAdopcion.findById(req.params.id)
      .populate('solIdUsuario')
      .populate('solIdMascota');
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la solicitud' });
  }
};

/**
 * @swagger
 * /solicitudes/{id}:
 *   put:
 *     summary: Actualizar una solicitud de adopción por ID
 *     tags: [SolicitudesAdopcion]
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
 *             $ref: '#/components/schemas/SolicitudAdopcion'
 *     responses:
 *       200:
 *         description: Solicitud actualizada
 *       400:
 *         description: Error al actualizar la solicitud
 */
exports.actualizarSolicitud = async (req, res) => {
  try {
    // Si el body incluye solIdMascota, validar que sea igual al actual
    if (req.body.solIdMascota) {
      const solicitudActual = await SolicitudAdopcion.findById(req.params.id);
      if (!solicitudActual) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      if (String(req.body.solIdMascota) !== String(solicitudActual.solIdMascota)) {
        return res.status(400).json({ error: 'No se puede modificar la mascota de la solicitud.' });
      }
    }
    const solicitud = await SolicitudAdopcion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(solicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/** * @swagger
 * /solicitudes/{id}:
 *   delete:
 *     summary: Eliminar una solicitud de adopción por ID
 *     tags: [SolicitudesAdopcion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitud eliminada
 *       404:
 *         description: Solicitud no encontrada
 *       500:
 *         description: Error del servidor
 */   

exports.borrarSolicitud = async (req, res) => {
  try {
    const solicitud = await SolicitudAdopcion.findByIdAndDelete(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json({ message: 'Solicitud eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar solicitud' });
  }
};  