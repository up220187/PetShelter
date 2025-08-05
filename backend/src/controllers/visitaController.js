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
    const { visIdMascota, visFechaVisita, visHoraVisita } = req.body;
    
    // Obtener la visita actual
    const visitaActual = await Visita.findById(req.params.id);
    if (!visitaActual) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }

    // Si se está cambiando mascota, fecha u hora, validar conflictos
    if (visIdMascota && visFechaVisita && visHoraVisita) {
      // Validar que no exista otra visita para la misma mascota en la misma fecha y hora
      // (excluyendo la visita actual que se está actualizando)
      const visitaExistente = await Visita.findOne({
        _id: { $ne: req.params.id }, // Excluir la visita actual
        visIdMascota,
        visFechaVisita,
        visHoraVisita
      });
      
      if (visitaExistente) {
        return res.status(400).json({ message: 'Ya existe una visita agendada para esta mascota en esa fecha y hora.' });
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
/**
 * @swagger
 * /visitas/horarios-disponibles:
 *   post:
 *     summary: Obtener horarios disponibles para una mascota en una fecha específica
 *     tags: [Visitas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visIdMascota:
 *                 type: string
 *                 description: ID de la mascota
 *               visFechaVisita:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la visita
 *               visitaActualId:
 *                 type: string
 *                 description: ID de la visita actual (para excluir en edición)
 *     responses:
 *       200:
 *         description: Lista de horarios disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 horariosDisponibles:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.obtenerHorariosDisponibles = async (req, res) => {
  try {
    const { visIdMascota, visFechaVisita, visitaActualId } = req.body;
    
    if (!visIdMascota || !visFechaVisita) {
      return res.status(400).json({ message: 'Se requiere ID de mascota y fecha de visita.' });
    }

    // Horarios disponibles del refugio (8:00 AM a 3:00 PM)
    const todosLosHorarios = [
      "08:00", "09:00", "10:00", "11:00", 
      "12:00", "13:00", "14:00", "15:00"
    ];

    // Buscar visitas existentes para esta mascota en esta fecha
    const query = {
      visIdMascota,
      visFechaVisita,
      visEstadoVisita: { $in: ['Confirmada', 'Pendiente'] } // Solo considerar visitas activas
    };

    // Si es una edición, excluir la visita actual
    if (visitaActualId) {
      query._id = { $ne: visitaActualId };
    }

    const visitasExistentes = await Visita.find(query);
    const horariosOcupados = visitasExistentes.map(visita => visita.visHoraVisita);

    // Filtrar horarios disponibles
    const horariosDisponibles = todosLosHorarios.filter(horario => 
      !horariosOcupados.includes(horario)
    );

    res.json({ horariosDisponibles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

exports.obtenerHorasOcupadas = async (req, res) => {
  try {
    const { idMascota, fecha } = req.params;
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 1);

    const visitas = await Visita.find({
      visIdMascota: idMascota,
      visFechaVisita: { $gte: fechaInicio, $lt: fechaFin },
      visEstadoVisita: { $ne: "Cancelada" } // solo válidas
    });

    const horasOcupadas = visitas.map(v => v.visHoraVisita);
    res.json(horasOcupadas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener horas ocupadas' });
  }
};
