const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EstadoSchema = new Schema({
    estDescripcion: {
        type: String,
        alias: "C_EstDescripcion",
        required: true
    }
});

module.exports = mongoose.model("Estado", EstadoSchema, "C_Estado");