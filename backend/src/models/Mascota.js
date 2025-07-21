const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MascotaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    // tipo de mascota con el catalogo de tipos
    raza: {
        type: String,
        required: true
    },
    nacimiento: {
        type: String,
        required: true
    },
    sexo: {
        type: String,
        required: true
    },
    tamaño: {
        type: String,
        enum: ['Pequeño', 'Mediano', 'Grande'],
        required: true
    },
    estadoSalud: {
        type: String,
        required: true
    },
    Comportamiento: {
        type: String,
        enum: ['Agresivo', 'Asustadizo', 'Juguetón', 'Tranquilo'],
        required: true
    },
    Esterilizado: {
        type: Boolean,
        required: true
    },
    imagen: {
        type: String, // URL de la imagen
        required: true
    },
    Estado: {
        type: String,
        enum: ['Disponible', 'En Proceso', 'Adoptado'],
        default: 'Disponible'
    }
    // atributo de id foraneo del refugio

});

module.exports = mongoose.model('Mascota', MascotaSchema);