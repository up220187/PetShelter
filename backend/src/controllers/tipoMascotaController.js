const TipoMascota = require('../models/TipoMascota');

exports.crearTipoMascota = async (req, res) => {
  try {
    const tipo = new TipoMascota(req.body);
    await tipo.save();
    res.status(201).json(tipo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerTiposMascota = async (req, res) => {
  try {
    const tipos = await TipoMascota.find();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipos de mascota' });
  }
};