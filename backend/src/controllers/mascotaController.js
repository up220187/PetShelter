const Mascota = require('../models/Mascota');

exports.crearMascota = async (req, res) => {
  try {
    const mascota = new Mascota(req.body);
    await mascota.save();
    res.status(201).json(mascota);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find()
      .populate('masIdTipoMascota')
      .populate('masIdRefugio');
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mascotas' });
  }
};

exports.obtenerMascotaPorId = async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id)
      .populate('masIdTipoMascota')
      .populate('masIdRefugio');
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
    res.json(mascota);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mascota' });
  }
};