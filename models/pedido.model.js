const mongoose = require("mongoose");
const { Schema } = mongoose;

const PedidoSchema = new Schema({
    idPedido: { type: String, unique: true },

    idUsuario: { type: String, required: true },

    productos: [{
        idProducto: { type: String, required: true },
        Nombre: { type: String, required: true },
        Imagen: { type: String },
        Precio: { type: Number, required: true },
        Cantidad: { type: Number, required: true, min: 1 }
    }],

    direccionEnvio: {
        Nombre: { type: String, required: true },
        Email: { type: String, required: true , match: [/^\S+@\S+\.\S+$/, "Correo inválido"]},
        Direccion: { type: String, required: true },
        Ciudad: { type: String, required: true },
        CodigoPostal: { type: String, required: true }
    },

    metodoPago: {
        type: String,
        required: true,
        enum: ["Tarjeta", "PayPal", "Transferencia"]
    },

    // detallesPago flexible según el método
    detallesPago: {
        type: Schema.Types.Mixed,
        default: {}
    },

    subtotal: { type: Number, required: true },
    envio: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },

    estadoPago: {
        type: String,
        enum: ["Pendiente", "Completado", "Reembolsado", "Fallido"],
        default: "Pendiente"
    },

    estadoEnvio: {
        type: String,
        enum: ["Pendiente", "En proceso", "Enviado", "Entregado"],
        default: "Pendiente"
    },

    fechaPago: { type: Date },
    fechaEnvio: { type: Date },
    fechaEntrega: { type: Date },

    transaccionId: { type: String }

}, { timestamps: true });

// Generador automático de ID de pedido con prefijo PED-
PedidoSchema.pre('save', async function(next) {
    if (!this.idPedido) {
        const count = await this.constructor.countDocuments();
        this.idPedido = `PED-${(count + 1).toString().padStart(6, '0')}`;
    }
    next();
});

module.exports = mongoose.model("Pedido", PedidoSchema, "pedidos");
