const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MascotaSchema = new Schema({
    masNombre: {
        type: String,
        alias: "T_MasNombre",
        required: true
    },
    
    masRaza: {
        type: String,
        alias: "T_MasRaza",
        required: true
    },

    masNacimiento: {
        type: String,
        alias: "T_MasNacimiento",
        required: true
    },

    masSexo: {
        type: String,
        enum: ['Macho', 'Hembra'],
        alias: "T_MasSexo",
        required: true
    },

    masTamaño: {
        type: String,
        enum: ['Pequeño', 'Mediano', 'Grande'],
        alias: "T_MasTamaño",
        required: true
    },

    masEstadoSalud: {
        type: String,
        alias: "T_MasEstadoSalud",
        required: true
    },
    
    masComportamiento: {
        type: String,
        enum: ['Agresivo', 'Asustadizo', 'Juguetón', 'Tranquilo'],
        required: true
    },

    masEsterilizado: {
        type: Boolean,
        alias: "T_MasEsterilizado",
        required: true
    },

    masEstado: {
        type: String,
        enum: ['Disponible', 'En Proceso', 'Adoptado'],
        alias: "T_MasEstado",
        default: 'Disponible'
    },
    // atributo de id foraneo del refugio

    masIdTipoMascota: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TipoMascota",
        alias: "T_MasIdTipoMascota",
        required: true
    },

    masImagen: {
        type: mongoose.Schema.Types.Mixed, //! Corregir
        alias: "T_MasImagen"
    },

    masIdRefugio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Refugio",
        alias: "T_MasIdRefugio",
        required: true
    }
});

module.exports = mongoose.model('Mascota', MascotaSchema, "T_Mascota");