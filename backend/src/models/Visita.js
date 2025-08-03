const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Visita:
 *       type: object
 *       required:
 *         - visIdUsuario
 *         - visIdMascota
 *         - visIdRefugio
 *       properties:
 *         visIdUsuario:
 *           type: string
 *           format: uuid
 *           description: ID del usuario que realiza la visita.
 *         visIdMascota:
 *           type: string
 *           format: uuid
 *           description: ID de la mascota a visitar.
 *         visIdRefugio:
 *           type: string
 *           format: uuid
 *           description: ID del refugio donde se realizará la visita.
 *         visFechaVisita:
 *           type: string
 *           format: date
 *           description: Fecha de la visita.
 *         visHoraVisita:
 *           type: string
 *           description: Hora programada para la visita (formato HH:mm).
 *         visEstadoVisita:
 *           type: string
 *           description: "Estado actual de la visita (por ejemplo: Confirmada, Cancelada, Realizada)."
 *       example:
 *         visIdUsuario: "60b9c3f1f5a3e240d0f4b123"
 *         visIdMascota: "60c9b5f1a5d3e244d1a4e111"
 *         visIdRefugio: "60c9d4a2b4f9e245d0f7c888"
 *         visFechaVisita: "2023-08-20"
 *         visHoraVisita: "14:00"
 *         visEstadoVisita: "Confirmada"
 */
const VisitaSchema = new mongoose.Schema({
    visIdUsuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Usuario", 
        alias: "T_VisIdUsuario", 
        required: true 
    },
    
    visIdMascota: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Mascota", 
        alias: "T_VisIdMascota", 
        required: true 
    },
    
    visIdRefugio: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Refugio", 
        alias: "T_VisIdRefugio",
        required: true 
    },
    
    visFechaVisita: { 
        type: Date, 
        alias: "T_VisFechaVisita" 
    },
    
    visHoraVisita: { 
        type: String, 
        alias: "T_VisHoraVisita" 
    },
    
    visEstadoVisita: { 
        type: String, 
        alias: "T_VisEstadoVisita" 
    }
});

module.exports = mongoose.model("Visita", VisitaSchema, "T_Visita");
