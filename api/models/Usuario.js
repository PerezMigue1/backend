const mongoose = require("mongoose");

// Subdocumento para la recuperación con referencia a la pregunta
const PreguntaRecuperacionSchema = new mongoose.Schema({
  pregunta: { type: String, required: true }, // Pregunta obligatoria
  respuesta: { type: String, required: true }, // Respuesta obligatoria
});

// Esquema del usuario
const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sexo: {
        type: String,
        enum: ["Masculino", "Femenino", "Otro"],
        required: true
    },
    edad: {
        type: Number,
        required: true
    },
    recuperacion: {
        type: PreguntaRecuperacionSchema,
        required: true
    },
    rol: {
        type: String,
        default: "turista",
        enum: ["turista", "miembro"],
        required: true
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Exporta el modelo de usuario apuntando a la colección 'usuarios'
module.exports = mongoose.model("Usuario", UsuarioSchema, "usuarios");
