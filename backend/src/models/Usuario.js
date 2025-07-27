const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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