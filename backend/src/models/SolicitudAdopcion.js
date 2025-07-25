const mongoose = require("mongoose");

// Modelo basado en la tabla T_SolicitudAdopcion del diccionario de datos
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
        alias: "T_SolEstado"
    },
    
    solFechaVisitaProgramada: { 
        type: Date, 
        alias: "T_SolFechaVisitaProgramada" 
    }
});

module.exports = mongoose.model("Solicitudadopcion", SolicitudAdopcionSchema, "T_SolicitudAdopcion");
