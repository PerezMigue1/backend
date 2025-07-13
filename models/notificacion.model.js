const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
    idUsuario: { type: String, required: true },
    tipo: { type: String, enum: ['publicacion', 'compra', 'sistema'], required: true },
    producto: { type: String }, // nombre del producto asociado (opcional)
    estado: { type: String, enum: ['pendiente', 'aprobado', 'rechazado', 'leido'], default: 'pendiente' },
    mensaje: { type: String, required: true },
    Motivo: { type: String }, // solo si fue rechazado
    fecha: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Notificacion', NotificacionSchema, 'notificaciones');
