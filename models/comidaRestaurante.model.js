const mongoose = require("mongoose");

const RestauranteInfoSchema = new mongoose.Schema({
    Nombre: { type: String, required: true },
    Ubicacion: {
        Municipio: { type: String },
        Estado: { type: String }
    }
}, { _id: false });

const ComidaRestauranteSchema = new mongoose.Schema({
    Nombre: { type: String, required: true },
    Descripcion: { type: String, required: true },
    Precio: { type: Number, required: true },
    Categoria: { type: String, required: true },
    Ingredientes: [{ type: String }],
    PasosPreparacion: [{ type: String }],
    Restaurante: { type: RestauranteInfoSchema, required: true },
    Imagenes: [{ type: String }],
    idRestaurante: { type: String, required: true },
    estadoRevision: { type: String, default: 'pendiente', enum: ['pendiente', 'aprobado', 'rechazado'] }
}, { timestamps: true });

module.exports = mongoose.model("ComidaRestaurante", ComidaRestauranteSchema, "comida-restaurante"); 