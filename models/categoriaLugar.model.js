const mongoose = require('mongoose');

const categoriaLugarSchema = new mongoose.Schema({
    idCtgLugar: { type: String, required: true, unique: true },
    Nombre: { type: String, required: true }
});

module.exports = mongoose.model('CategoriaLugar', categoriaLugarSchema, 'categoria-lugares');
