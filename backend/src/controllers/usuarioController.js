const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const Estado = require('../models/Estado');

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
exports.crearUsuario = async (req, res) => {
  try {
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.usuContraseña, salt);
    
    const usuario = new Usuario({
      ...req.body,
      usuContraseña: hashedPassword
    });
    
    await usuario.save();
    
    // No devolver la contraseña en la respuesta
    const usuarioSinPassword = usuario.toObject();
    delete usuarioSinPassword.usuContraseña;
    
    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios (sin contraseña)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error del servidor
 */
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().populate('usuEstado');
    
    // Eliminar contraseñas de la respuesta
    const usuariosSinPassword = usuarios.map(usuario => {
      const usuarioObj = usuario.toObject();
      delete usuarioObj.usuContraseña;
      return usuarioObj;
    });
    
    res.json(usuariosSinPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a obtener
 *     responses:
 *       200:
 *         description: Usuario encontrado (sin contraseña)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Error en la petición
 */
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id).populate('usuEstado');
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const usuarioSinPassword = usuario.toObject();
    delete usuarioSinPassword.usuContraseña;
    res.json(usuarioSinPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuCorreo:
 *                 type: string
 *               usuContraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 *       400:
 *         description: Error en la petición
 */
exports.loginUsuario = async (req, res) => {
  try {
    const { usuCorreo, usuContraseña } = req.body;
    
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ usuCorreo }).populate('usuEstado');
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(usuContraseña, usuario.usuContraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // No devolver la contraseña en la respuesta
    const usuarioSinPassword = usuario.toObject();
    delete usuarioSinPassword.usuContraseña;
    
    res.json(usuarioSinPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 *       404:
 *         description: Usuario no encontrado
 */
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    let datosActualizados = { ...req.body };

    // Si se actualiza la contraseña, encriptarla
    if (datosActualizados.usuContraseña) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.usuContraseña = await bcrypt.hash(datosActualizados.usuContraseña, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, datosActualizados, { new: true }).populate('usuEstado');
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuarioSinPassword = usuario.toObject();
    delete usuarioSinPassword.usuContraseña;

    res.json(usuarioSinPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Error en la petición
 */
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};