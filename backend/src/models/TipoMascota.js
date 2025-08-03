const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoMascota:
 *       type: object
 *       required:
 *         - tiMDescripcion
 *       properties:
 *         tiMDescripcion:
 *           type: string
 *           description: Descripción del tipo de mascota (perro, gato, etc.).
 *       example:
 *         tiMDescripcion: "Gato"
 */
const TipoMascotaSchema = new Schema({
    tiMDescripcion: {
        type: String,
        alias: "C_TiMDescripcion",
        required: true
    }
});

module.exports = mongoose.model("TipoMascota", TipoMascotaSchema, "C_TipoMascota");