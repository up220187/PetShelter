const mongoose = require("mongoose");

// Modelo basado en la tabla T_Refugio del diccionario de datos
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
