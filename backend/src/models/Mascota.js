const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     Mascota:
 *       type: object
 *       required:
 *         - masNombre
 *         - masRaza
 *         - masNacimiento
 *         - masSexo
 *         - masTamaño
 *         - masEstadoSalud
 *         - masComportamiento
 *         - masEsterilizado
 *         - masTipo
 *         - masIdRefugio
 *       properties:
 *         masNombre:
 *           type: string
 *           description: Nombre de la mascota.
 *         masRaza:
 *           type: string
 *           description: Raza de la mascota.
 *         masNacimiento:
 *           type: string
 *           description: Fecha de nacimiento (formato YYYY-MM-DD).
 *         masSexo:
 *           type: string
 *           enum: [Macho, Hembra]
 *           description: Sexo de la mascota.
 *         masTamaño:
 *           type: string
 *           enum: [Pequeño, Mediano, Grande]
 *           description: Tamaño de la mascota.
 *         masEstadoSalud:
 *           type: string
 *           description: Estado de salud de la mascota.
 *         masComportamiento:
 *           type: string
 *           enum: [Agresivo, Asustadizo, Juguetón, Tranquilo]
 *           description: Comportamiento general.
 *         masEsterilizado:
 *           type: boolean
 *           description: Indica si la mascota está esterilizada.
 *         masEstado:
 *           type: string
 *           enum: [Disponible, En Proceso, Adoptado]
 *           description: Estado actual de adopción.
 *         masTipo:
 *           type: string
 *           enum: [Perro, Gato, Ave, Reptil, Roedor, Otro]
 *           description: Tipo de mascota.
 *         masImagen:
 *           type: object
 *           description: Imagen o galería (puede ser mixto).
 *         masIdRefugio:
 *           type: string
 *           format: uuid
 *           description: ID del refugio al que pertenece.
 *       example:
 *         masNombre: "Fido"
 *         masRaza: "Labrador"
 *         masNacimiento: "2020-06-15"
 *         masSexo: "Macho"
 *         masTamaño: "Grande"
 *         masEstadoSalud: "Sano"
 *         masComportamiento: "Juguetón"
 *         masEsterilizado: true
 *         masEstado: "Disponible"
 *         masTipo: "Perro"
 *         masImagen: { url: "https://example.com/fido.jpg" }
 *         masIdRefugio: "60a7c5f7f1d2c731d8f8c123"
 */
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
    // atributo de tipo de mascota

    masTipo: {
        type: String,
        enum: ['Perro', 'Gato', 'Ave', 'Reptil', 'Roedor', 'Otro'],
        alias: "T_MasTipo",
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