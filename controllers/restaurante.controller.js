const Restaurante = require('../models/restaurante.model');

// Obtener todos los restaurantes
exports.obtenerRestaurantes = async (req, res) => {
  try {
    const restaurantes = await Restaurante.find();
    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener restaurantes', error });
  }
};

// Obtener restaurante por idRestaurante
exports.obtenerRestaurantePorId = async (req, res) => {
  try {
    const restaurante = await Restaurante.findOne({ idRestaurante: req.params.id });
    if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
    res.json(restaurante);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener restaurante', error });
  }
};

// Crear restaurante
exports.crearRestaurante = async (req, res) => {
  try {
    const nuevoRestaurante = new Restaurante(req.body);
    await nuevoRestaurante.save();
    res.status(201).json({
      mensaje: 'Restaurante creado correctamente',
      restaurante: nuevoRestaurante
    });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear restaurante', error });
  }
};

// Actualizar restaurante
exports.actualizarRestaurante = async (req, res) => {
  try {
    const restaurante = await Restaurante.findOneAndUpdate(
      { idRestaurante: req.params.id },
      req.body,
      { new: true }
    );
    if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
    res.json(restaurante);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar restaurante', error });
  }
};

// Eliminar restaurante
exports.eliminarRestaurante = async (req, res) => {
  try {
    const restaurante = await Restaurante.findOneAndDelete({ idRestaurante: req.params.id });
    if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
    res.json({ mensaje: 'Restaurante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar restaurante', error });
  }
}; 