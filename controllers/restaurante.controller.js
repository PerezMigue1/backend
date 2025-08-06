const Restaurante = require('../models/restaurante.model');
const mongoose = require('mongoose');

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
    let restaurante;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      restaurante = await Restaurante.findById(req.params.id);
    }
    if (!restaurante) {
      restaurante = await Restaurante.findOne({ idRestaurante: req.params.id });
    }
    if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });

    // Adaptar los campos a lo que espera el frontend
    const adaptado = {
      _id: restaurante._id,
      Nombre: restaurante.Nombre,
      Restaurante: restaurante.Nombre, // alias
      Descripcion: restaurante.Descripcion,
      descripcion: restaurante.Descripcion, // alias
      Ubicacion: restaurante.Ubicacion,
      Horario: restaurante.Horario,
      HorarioAtencion: restaurante.Horario, // alias
      horario: restaurante.Horario, // alias
      Contacto: restaurante.Contacto,
      contacto: restaurante.Contacto, // alias
      Telefono: restaurante.Contacto, // alias
      Correo: restaurante.Contacto, // alias
      Categoria: restaurante.Categoria,
      categoria: restaurante.Categoria, // alias
      RedesSociales: restaurante.RedesSociales,
      redesSociales: restaurante.RedesSociales, // alias
      RedesSocialesRestaurante: restaurante.RedesSociales, // alias
      Reseñas: restaurante.Reseñas,
      resenas: restaurante.Reseñas, // alias
      Imagenes: restaurante.Imagenes,
      Recomendado: restaurante.Recomendado,
      idRestaurante: restaurante.idRestaurante,
      createdAt: restaurante.createdAt,
      updatedAt: restaurante.updatedAt
    };
    res.json(adaptado);
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

// Actualizar restaurante por idRestaurante o _id
exports.actualizarRestaurante = async (req, res) => {
    try {
        let restaurante;

        // Intentar buscar por ObjectId primero, luego por idRestaurante
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            // Es un ObjectId válido
            restaurante = await Restaurante.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
        } else {
            // Es un idRestaurante personalizado
            restaurante = await Restaurante.findOneAndUpdate(
                { idRestaurante: req.params.id },
                req.body,
                { new: true }
            );
        }

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