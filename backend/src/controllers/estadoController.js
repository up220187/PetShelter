const Estado = require('../models/Estado');

exports.crearEstado = async (req, res) => {
  try {
    const estado = new Estado(req.body);
    await estado.save();
    res.status(201).json(estado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerEstados = async (req, res) => {
  try {
    const estados = await Estado.find();
    res.json(estados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estados' });
  }
};