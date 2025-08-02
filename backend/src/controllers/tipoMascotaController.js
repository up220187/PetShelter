const TipoMascota = require('../models/TipoMascota');

/**
 * @swagger
 * /tiposMascotas:
 *   post:
 *     summary: Crear un nuevo tipo de mascota
 *     tags: [TiposMascota]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoMascota'
 *     responses:
 *       201:
 *         description: Tipo de mascota creado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
exports.crearTipoMascota = async (req, res) => {
  try {
    const tipo = new TipoMascota(req.body);
    await tipo.save();
    res.status(201).json(tipo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /tiposMascotas:
 *   get:
 *     summary: Obtener todos los tipos de mascota
 *     tags: [TiposMascota]
 *     responses:
 *       200:
 *         description: Lista de tipos de mascota
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoMascota'
 *       500:
 *         description: Error del servidor
 */
exports.obtenerTiposMascota = async (req, res) => {
  try {
    const tipos = await TipoMascota.find();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipos de mascota' });
  }
};