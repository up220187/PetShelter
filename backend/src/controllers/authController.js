const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const errorHandler = require('../middlewares/databaseErrorHandler');

const User = require('../models/Usuario');
const RefreshToken = require('../models/RefreshToken');
const router = express.Router();

const generateToken = (userId, usuNombre) => jwt.sign({ userId, usuNombre }, process.env.JWT_SECRET, { expiresIn: '1h' });

const checkUserExists = async (usuCorreo) => User.findOne({ usuCorreo });

const hashPassword = async (usuContraseña) => bcrypt.hash(usuContraseña, 10);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuNombre
 *               - usuCorreo
 *               - usuContraseña
 *             properties:
 *               usuNombre:
 *                 type: string
 *                 description: Nombre del usuario
 *               usuCorreo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               usuContraseña:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la petición
 *       500:
 *         description: Error interno del servidor
 */
exports.register = async (req, res) => {
    try {
        const {usuNombre, usuCorreo, usuContraseña} = req.body;

        const existingUser = await checkUserExists(usuCorreo);
        if(existingUser) {
            return res.status(400).json({ message: 'User already exists'});
        }

        const hashedPassword = await hashPassword(usuContraseña);

        const newUser = new User({
            usuNombre,
            usuCorreo,
            usuContraseña: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado '});
    } catch (error) {
        errorHandler(error, req, res);
    }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuCorreo
 *               - usuContraseña
 *             properties:
 *               usuCorreo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               usuContraseña:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de acceso
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
exports.login = async (req, res) => {
    try {
        const { usuCorreo, usuContraseña } = req.body;

        const user = await checkUserExists(usuCorreo);
        if(!user) {
            return res.status(400).json({ message: 'Usuario no existe' });
        }

        const isMatch = await bcrypt.compare(usuContraseña, user.usuContraseña);
        if(!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = generateToken(user._id, user.usuNombre);

        res.status(200).json({
            token,
            user: {
                usuId: user._id, // ← aquí se incluye el ID del usuario
                usuCorreo: user.usuCorreo,
                usuNombre: user.usuNombre,
                usuRol: user.usuRol, // opcional si manejas roles
                usuFotoPerfil: user.usuFotoPerfil // ← Agregar la foto de perfil
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error interno del servidor' });
    }
};


/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresca el token de acceso
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresco
 *     responses:
 *       200:
 *         description: Token refrescado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Nuevo token de acceso
 *                 refreshToken:
 *                   type: string
 *                   description: Nuevo token de refresco
 *       400:
 *         description: Token de refresco inválido
 *       500:
 *         description: Error interno del servidor
 */

const generateRefreshToken = async (userId, usuNombre) => {
    const refreshToken = jwt.sign({ userId, usuNombre }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    await RefreshToken.create({ userId, token: refreshToken });
    return refreshToken;
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'El token de refresco es requerido' });
        }

        const existingToken = await RefreshToken.findOne({ token: refreshToken });
        if (!existingToken) {
            return res.status(400).json({ message: 'Token de refresco inválido' });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Token de refresco inválido' });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ message: 'Usuario no existe' });
        }

        const token = generateToken(user._id, user.usuNombre);
        const newRefreshToken = await generateRefreshToken(user._id, user.usuNombre);

        await existingToken.deleteOne();

        res.status(200).json({ token, refreshToken: newRefreshToken });
    } catch (error) {
        errorHandler(error, req, res);
    }
};
