const mongoose = require("mongoose");

const NegocioSchema = new mongoose.Schema({
    Nombre: { type: String, required: true },
    Categoria: { type: String, required: true },
    Descripcion: { type: String },
    
    Ubicacion: {
        Estado: { type: String },
        Municipio: { type: String },
        Coordenadas: {
            lat: { type: Number },
            lng: { type: Number }
        },
        Direccion: { type: String }
    },
    
    RedesSociales: {
        Facebook: { type: String },
        Instagram: { type: String },
        WhatsApp: { type: String }
    },
    
    Promociones: { type: String },
    
    Reseñas: [
        {
            Usuario: { type: String },
            Comentario: { type: String },
            Calificacion: { type: Number }
        }
    ],
    
    Imagenes: [{ type: String }],
    
    Horario: { type: String },
    Contacto: { type: String },
    Recomendado: { type: Boolean, default: false }
    
}, { timestamps: true });

module.exports = mongoose.model("Negocio", NegocioSchema, "negocio");