const mongoose = require("mongoose");

const CategoriaProductoSchema = new mongoose.Schema({
    idCategoria: { type: String, required: true, unique: true },
    Nombre: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model("Categoria", CategoriaProductoSchema, "categoria-productos");
