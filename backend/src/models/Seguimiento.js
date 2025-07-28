const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Seguimiento:
 *       type: object
 *       required:
 *         - segIdMascotas
 *         - segIdUsuario
 *       properties:
 *         segIdMascotas:
 *           type: string
 *           format: uuid
 *           description: ID de la mascota relacionada con el seguimiento.
 *         segIdUsuario:
 *           type: string
 *           format: uuid
 *           description: ID del usuario que realiza el seguimiento.
 *         segFecha:
 *           type: string
 *           format: date
 *           description: Fecha en la que se realizó el seguimiento.
 *         segFotos:
 *           type: object
 *           description: Archivos multimedia o fotos (estructura flexible).
 *         segComentarios:
 *           type: string
 *           description: Comentarios adicionales sobre el estado de la mascota.
 *       example:
 *         segIdMascotas: "60c9b5f1a5d3e244d1a4e111"
 *         segIdUsuario: "60b9c3f1f5a3e240d0f4b123"
 *         segFecha: "2023-08-15"
 *         segFotos: { urls: ["https://example.com/foto1.jpg", "https://example.com/foto2.jpg"] }
 *         segComentarios: "La mascota se encuentra en buen estado, juega mucho y come bien."
 */
const SeguimientoSchema = new mongoose.Schema({
    segIdMascotas: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Mascota", 
        alias: "T_SegIdMascotas", 
        required: true 
    },

    segIdUsuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Usuario", 
        alias: "T_SegIdUsuario", 
        required: true 
    },
    
    segFecha: { 
        type: Date, 
        alias: 
        "T_SegFecha" 
    },
    
    segFotos: { 
        type: mongoose.Schema.Types.Mixed, 
        alias: "T_SegFotos" 
    },
    
    segComentarios: { 
        type: String, 
        alias: "T_SegComentarios" 
    }
});

module.exports = mongoose.model("Seguimiento", SeguimientoSchema, "T_Seguimiento");
