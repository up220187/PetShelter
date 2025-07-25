const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const TipoMascotaSchema = new Schema({
    tiMDescripcion: {
        type: String,
        alias: "C_TiMDescripcion",
        required: true
    }
});

module.exports = mongoose.model("TipoMascota", TipoMascotaSchema, "C_TipoMascota");