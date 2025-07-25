const mongoose = require("mongoose");

// Modelo basado en la tabla T_Visita del diccionario de datos
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
