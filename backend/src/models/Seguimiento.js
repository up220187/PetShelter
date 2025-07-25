const mongoose = require("mongoose");

// Modelo basado en la tabla T_Seguimiento del diccionario de datos
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
