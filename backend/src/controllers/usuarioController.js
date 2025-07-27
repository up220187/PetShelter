const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const Estado = require('../models/Estado');

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