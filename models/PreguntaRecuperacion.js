const mongoose = require("mongoose");

const PreguntaRecuperacionSchema = new mongoose.Schema({
    pregunta: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("PreguntaRecuperacion", PreguntaRecuperacionSchema, "pregunta-seguridad");
