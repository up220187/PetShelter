const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    contraseña: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    direccion: {
        type: String,
        required: true
    }, 
    rol: {
        type: Enum,
        values: ['Adoptante', 'refugio'],
        required: true
    }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;