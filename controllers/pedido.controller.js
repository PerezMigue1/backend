const Pedido = require("../models/pedido.model");

// Crear un nuevo pedido
exports.crearPedido = async (req, res) => {
    try {
        console.log("🟡 Pedido recibido:", req.body);
        console.log("🟢 Usuario autenticado:", req.usuario);

        const datosPedido = req.body;
        datosPedido.idUsuario = req.usuario.id;

        console.log("🧾 detallesPago:", datosPedido.detallesPago);
        console.log("Método recibido:", datosPedido.metodoPago); // Debe mostrar: "Tarjeta"

        console.log("🔵 Datos recibidos:", datosPedido);

        // Validar campos según el método de pago
        const metodo = datosPedido.metodoPago;
        const detalles = datosPedido.detallesPago;
        
        console.log("🔵 Método de pago:", metodo);
        console.log("🔵 Detalles de pago:", detalles);

        if (metodo === "Tarjeta") {
            if (!detalles?.numeroTarjeta || !detalles?.vencimiento || !detalles?.cvv) {
                return res.status(400).json({ error: "Faltan datos de tarjeta" });
            }
        }
        if (metodo === "PayPal") {
            if (!detalles?.cuentaPaypal) {
                return res.status(400).json({ error: "Falta correo de PayPal" });
            }
        }
        if (metodo === "Transferencia") {
            if (!detalles?.referenciaTransferencia) {
                return res.status(400).json({ error: "Falta referencia de transferencia" });
            }
        }

        // Estado de pago y fecha
        datosPedido.estadoPago = "Completado";
        datosPedido.fechaPago = new Date();

        // Generar idPedido incremental
        const ultimoPedido = await Pedido.findOne().sort({ createdAt: -1 });
        let nuevoNumero = 1;

        if (ultimoPedido && ultimoPedido.idPedido) {
            const partes = ultimoPedido.idPedido.split("-");
            const ultimoNum = parseInt(partes[1]);
            if (!isNaN(ultimoNum)) {
                nuevoNumero = ultimoNum + 1;
            }
        }

        datosPedido.idPedido = `PED-${nuevoNumero.toString().padStart(6, "0")}`;

        // Guardar
        const nuevoPedido = new Pedido(datosPedido);
        const pedidoGuardado = await nuevoPedido.save();

        res.status(201).json(pedidoGuardado);
    } catch (error) {
        console.error("🔴 Error al crear el pedido:", error);
        res.status(400).json({ mensaje: "Error al crear el pedido", error });
    }
};

// Obtener todos los pedidos del usuario autenticado
exports.obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find({ idUsuario: req.usuario.id });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los pedidos", error });
    }
};

// Obtener un pedido por ID (solo si pertenece al usuario)
exports.obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ mensaje: "Pedido no encontrado" });
        if (pedido.idUsuario !== req.usuario.id)
            return res.status(403).json({ mensaje: "No tienes permiso para ver este pedido" });

        res.json(pedido);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el pedido", error });
    }
};

// Actualizar un pedido (solo si pertenece al usuario)
exports.actualizarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ mensaje: "Pedido no encontrado" });
        if (pedido.idUsuario !== req.usuario.id)
            return res.status(403).json({ mensaje: "No tienes permiso para actualizar este pedido" });

        const actualizado = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar el pedido", error });
    }
};

// Eliminar un pedido (solo si pertenece al usuario)
exports.eliminarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ mensaje: "Pedido no encontrado" });
        if (pedido.idUsuario !== req.usuario.id)
            return res.status(403).json({ mensaje: "No tienes permiso para eliminar este pedido" });

        await Pedido.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el pedido", error });
    }
};

// Obtener todos los pedidos del sistema (solo admin)
exports.obtenerTodosLosPedidosAdmin = async (req, res) => {
    try {
        const pedidos = await Pedido.find();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener pedidos", error });
    }
};
