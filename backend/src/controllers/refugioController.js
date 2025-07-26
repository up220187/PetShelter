const Refugio = require('../models/Refugio');

exports.crearRefugio = async (req, res) => {
  try {
    const refugio = new Refugio(req.body);
    await refugio.save();
    res.status(201).json(refugio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerRefugios = async (req, res) => {
  try {
    const refugios = await Refugio.find().populate('refIdUsuario');
    res.json(refugios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener refugios' });
  }
};