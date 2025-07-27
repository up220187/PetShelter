const SolicitudAdopcion = require('../models/SolicitudAdopcion');

exports.crearSolicitud = async (req, res) => {
  try {
    const solicitud = new SolicitudAdopcion(req.body);
    await solicitud.save();
    res.status(201).json(solicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

exports.actualizarSolicitud = async (req, res) => {
  try {
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