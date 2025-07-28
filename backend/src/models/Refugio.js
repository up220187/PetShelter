const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Refugio:
 *       type: object
 *       required:
 *         - refNombre
 *         - refIdUsuario
 *       properties:
 *         refNombre:
 *           type: string
 *           description: Nombre del refugio.
 *         refDireccion:
 *           type: string
 *           description: Dirección física del refugio.
 *         refDescripcion:
 *           type: string
 *           description: Breve descripción del refugio.
 *         refHorarioAtencion:
 *           type: string
 *           description: Horarios de atención al público.
 *         refIdUsuario:
 *           type: string
 *           format: uuid
 *           description: ID del usuario responsable del refugio.
 *       example:
 *         refNombre: "Refugio Patitas"
 *         refDireccion: "Calle 123, Ciudad"
 *         refDescripcion: "Refugio de perros y gatos en situación de calle."
 *         refHorarioAtencion: "Lunes a Viernes 9:00 - 18:00"
 *         refIdUsuario: "60b9c3f1f5a3e240d0f4b123"
 */
const RefugioSchema = new mongoose.Schema({
    refNombre: { 
        type: String, 
        alias: "T_RefNombre", 
        required: true 
    },

    refDireccion: { 
        type: String, 
        alias: "T_RefDireccion" 
    },

    refDescripcion: { 
        type: String, 
        alias: "T_RefDescripcion" 
    },

    refHorarioAtencion: { 
        type: String, 
        alias: "T_RefHorarioAtencion" 
    },

    refIdUsuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Usuario", 
        alias: "T_RefIdUsuario", 
        required: true 
    }
    
});

module.exports = mongoose.model("Refugio", RefugioSchema, "T_Refugio");
