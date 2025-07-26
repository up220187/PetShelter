const Seguimiento = require('../models/Seguimiento');

exports.crearSeguimiento = async (req, res) => {
  try {
    const seguimiento = new Seguimiento(req.body);
    await seguimiento.save();
    res.status(201).json(seguimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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