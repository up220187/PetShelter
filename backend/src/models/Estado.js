const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     Estado:
 *       type: object
 *       required:
 *         - estDescripcion
 *       properties:
 *         estDescripcion:
 *           type: string
 *           description: Descripción del estado.
 *       example:
 *         estDescripcion: "Activo"
 */
const EstadoSchema = new Schema({
    estDescripcion: {
        type: String,
        alias: "C_EstDescripcion",
        required: true
    }
});

module.exports = mongoose.model("Estado", EstadoSchema, "C_Estado");