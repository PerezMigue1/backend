const mongoose = require("mongoose");

// Subdocumento para la recuperación
const PreguntaRecuperacionSchema = new mongoose.Schema({
    pregunta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PreguntaRecuperacion", // nombre del modelo
        required: true
    },
    respuesta: {
        type: String,
        required: true
    }
});

// Esquema principal de usuario
const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    telefono: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    sexo: { type: String, enum: ["Masculino", "Femenino", "Otro"], required: true },
    edad: { type: Number, required: true },
    recuperacion: { type: PreguntaRecuperacionSchema, required: true },
    rol: { type: [String], default: ["turista"], enum: ["turista", "artesano", "hospedero", "chef", "restaurante", "admin"] },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Usuario", UsuarioSchema, "usuarios");
