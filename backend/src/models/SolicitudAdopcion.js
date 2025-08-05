const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     SolicitudAdopcion:
 *       type: object
 *       required:
 *         - solIdUsuario
 *         - solIdMascota
 *       properties:
 *         solIdUsuario:
 *           type: string
 *           format: uuid
 *           description: ID del usuario que solicita la adopción.
 *         solIdMascota:
 *           type: string
 *           format: uuid
 *           description: ID de la mascota solicitada.
 *         solFechaSolicitud:
 *           type: string
 *           format: date
 *           description: Fecha en que se realizó la solicitud.
 *         solEstado:
 *           type: string
 *           description: "Estado actual de la solicitud (por ejemplo: Pendiente, Aprobada, Rechazada)."
 *         solFechaVisitaProgramada:
 *           type: string
 *           format: date
 *           description: Fecha programada para realizar la visita.
 *       example:
 *         solIdUsuario: "60b9c3f1f5a3e240d0f4b123"
 *         solIdMascota: "60c9b5f1a5d3e244d1a4e111"
 *         solFechaSolicitud: "2023-07-01"
 *         solEstado: "Pendiente"
 *         solFechaVisitaProgramada: "2023-07-15"
 */
const SolicitudAdopcionSchema = new mongoose.Schema({
    solIdUsuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Usuario", 
        alias: "T_SolIdUsuario", 
        required: true 
    },
    
    solIdMascota: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Mascota", 
        alias: "T_SolIdMascota", 
        required: true 
    },
    
    solFechaSolicitud: { 
        type: Date, 
        alias: "T_SolFechaSolicitud" 
    },
    
    solEstado: { 
        type: String, 
        enum: ["Pendiente", "Aprobada", "Rechazada"],
        alias: "T_SolEstado"
    },
    
    solFechaVisitaProgramada: { 
        type: Date, 
        alias: "T_SolFechaVisitaProgramada" 
    }
});

module.exports = mongoose.model("Solicitudadopcion", SolicitudAdopcionSchema, "T_SolicitudAdopcion");
