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
 *           format: uuid
 *           description: ID del estado asociado al usuario.
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
 *         usuEstado: "60b9c3f1f5a3e240d0f4b123"
 *         usuDireccion: "Av. Libertad #321"
 *         usuRol: "adoptante"
 */
const UsuarioSchema = new Schema({
    usuNombre: { 
        type: String, 
        alias: "T_UsuNombre", 
        required: true 
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
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Estado", 
        alias: "T_UsuEstado", 
        required: true 
    },

    usuDireccion: { type: String, 
        alias: "T_UsuDireccion" 
    },

    usuRol: {
        type: String,
        values: ['adoptante', 'refugio'],
        alias: "T_UsuRol",
        required: true
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema, "T_Usuario");