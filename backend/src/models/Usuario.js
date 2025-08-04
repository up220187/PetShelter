const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - usuNombre
 *         - usuCorreo
 *         - usuContraseña
 *         - usuEstado
 *         - usuRol
 *       properties:
 *         usuNombre:
 *           type: string
 *           description: Nombre completo del usuario.
 *         usuCorreo:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario.
 *         usuContraseña:
 *           type: string
 *           format: password
 *           description: Contraseña cifrada del usuario.
 *         usuTelefono:
 *           type: string
 *           description: Teléfono de contacto.
 *         usuEstado:
 *           type: string
 *           enum: [Activo, Inactivo, Suspendido]
 *           description: Estado del usuario.
 *         usuDireccion:
 *           type: string
 *           description: Dirección del usuario.
 *         usuRol:
 *           type: string
 *           enum: [adoptante, refugio]
 *           description: Rol del usuario dentro de la plataforma.
 *       example:
 *         usuNombre: "Ana Pérez"
 *         usuCorreo: "ana.perez@example.com"
 *         usuContraseña: "hashedpassword123"
 *         usuTelefono: "5551234567"
 *         usuEstado: "Activo"
 *         usuDireccion: "Av. Libertad #321"
 *         usuRol: "adoptante"
 */
const UsuarioSchema = new Schema({
    usuNombre: { 
        type: String, 
        alias: "T_UsuNombre", 
    },

    usuCorreo: { 
        type: String, 
        alias: "T_UsuCorreo", 
        required: true 
    },

    usuContraseña: { 
        type: String, 
        alias: "T_UsuContraseña", 
        required: true 
    },

    usuTelefono: { 
        type: String, 
        alias: "T_UsuTelefono" 
    },

    usuEstado: { 
        type: String,
        enum: ['Activo', 'Inactivo', 'Suspendido'],
        alias: "T_UsuEstado",
        default: 'Activo'
    },

    usuDireccion: { type: String, 
        alias: "T_UsuDireccion" 
    },

    usuRol: {
        type: String,
        values: ['adoptante', 'refugio'],
        alias: "T_UsuRol",
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema, "T_Usuario");