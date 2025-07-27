const Visita = require('../models/Visita');

exports.crearVisita = async (req, res) => {
  try {
    const visita = new Visita(req.body);
    await visita.save();
    res.status(201).json(visita);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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