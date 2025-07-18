const Usuario = require("../models/usuario.model");
const Pregunta = require("../models/pregunta.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// ✅ Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Crear nuevo usuario
exports.crearUsuario = async (req, res) => {
    try {
        const {
            nombre, telefono, email, password,
            sexo, edad, recuperacion, rol
        } = req.body;

        // Validación de campos requeridos
        if (!nombre || !telefono || !email || !password || !sexo || !edad ||
            !recuperacion?.pregunta || !recuperacion?.respuesta) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        const existe = await Usuario.findOne({ email });
        if (existe) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({
            nombre,
            telefono,
            email,
            password: hashedPassword,
            sexo,
            edad,
            recuperacion: {
                pregunta: recuperacion.pregunta, // ID de pregunta
                respuesta: recuperacion.respuesta
            },
            rol
        });

        await nuevoUsuario.save();
        res.status(201).json({
            message: "Usuario creado correctamente",
            usuario: nuevoUsuario
        });

    } catch (error) {
        console.error("❌ Error al crear usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// ✅ Login de usuario
exports.loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar token JWT con id y rol
        const token = jwt.sign(
            {
                id: usuario._id,
                email: usuario.email,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // 1 día de expiración
        );

        res.json({
            message: "Inicio de sesión exitoso",
            token, // Aquí se devuelve el token
            usuario: {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
                // Puedes devolver más datos si deseas, pero evita la contraseña
            }
        });

    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};


// ✅ Paso 1: Obtener pregunta de recuperación
exports.obtenerPreguntaRecuperacion = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ email }).populate("recuperacion.pregunta");

        if (!usuario) {
            return res.status(404).json({ message: "Correo no encontrado" });
        }

        res.json({ pregunta: usuario.recuperacion.pregunta.pregunta });

    } catch (error) {
        console.error("❌ Error al obtener pregunta de recuperación:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};




// ✅ Paso 2: Validar respuesta secreta
exports.validarRespuestaRecuperacion = async (req, res) => {
    try {
        const { email, respuesta } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).json({ message: "Correo no encontrado" });
        }

        const respuestaCorrecta = usuario.recuperacion.respuesta.toLowerCase().trim();
        const respuestaUsuario = respuesta.toLowerCase().trim();

        if (respuestaCorrecta !== respuestaUsuario) {
            return res.status(401).json({
                message: "Respuesta incorrecta",
                pregunta: usuario.recuperacion.pregunta
            });
        }

        // Generar token temporal válido por 15 minutos
        const token = crypto.randomBytes(32).toString('hex');
        usuario.resetPasswordToken = token;
        usuario.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
        await usuario.save();

        res.json({
            success: true,
            token,
            email: usuario.email
        });

    } catch (error) {
        console.error("❌ Error al validar respuesta:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Paso 3: Cambiar contraseña con token
exports.cambiarPassword = async (req, res) => {
    try {
        const { email, token, nuevaPassword } = req.body;

        const usuario = await Usuario.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ message: "Token inválido o expirado" });
        }

        usuario.password = await bcrypt.hash(nuevaPassword, 10);
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;
        await usuario.save();

        res.json({ message: "Contraseña actualizada correctamente" });

    } catch (error) {
        console.error("❌ Error al cambiar contraseña:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Actualizar usuario por ID
exports.actualizarUsuario = async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({
            message: "Usuario actualizado correctamente",
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Eliminar usuario por ID
exports.eliminarUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

        if (!usuarioEliminado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({
            message: "Usuario eliminado correctamente",
            usuario: usuarioEliminado
        });

    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Obtener perfil de usuario
exports.obtenerPerfilUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpires");
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        console.error("❌ Error al obtener perfil:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Actualizar perfil de usuario
exports.actualizarPerfilUsuario = async (req, res) => {
    try {
        const camposPermitidos = ['nombre', 'telefono', 'sexo', 'edad'];
        const actualizaciones = {};

        camposPermitidos.forEach(campo => {
            if (req.body[campo] !== undefined) {
                actualizaciones[campo] = req.body[campo];
            }
        });

        const usuario = await Usuario.findByIdAndUpdate(req.params.id, actualizaciones, { new: true });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Perfil actualizado correctamente", usuario });
    } catch (error) {
        console.error("❌ Error al actualizar perfil:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// ✅ Cambiar contraseña desde perfil (requiere contraseña actual)
exports.cambiarPasswordDesdePerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { actualPassword, nuevaPassword } = req.body;

        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const esValida = await bcrypt.compare(actualPassword, usuario.password);
        if (!esValida) {
            return res.status(401).json({ message: "Contraseña actual incorrecta" });
        }

        usuario.password = await bcrypt.hash(nuevaPassword, 10);
        await usuario.save();

        res.json({ message: "Contraseña actualizada correctamente" });

    } catch (error) {
        console.error("❌ Error al cambiar contraseña desde perfil:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Agrega esta función a tu controlador
exports.obtenerDetallesUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id)
            .select('-password -preguntaSecreta -respuestaSecreta')
            .populate('productos', 'nombre precio estado')
            .populate('pedidos', 'estado total fecha');

        if (!usuario) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
        }

        // Estadísticas adicionales
        const productosCount = await Producto.countDocuments({ creador: req.params.id });
        const pedidosCount = await Pedido.countDocuments({ usuario: req.params.id });

        res.json({
            ok: true,
            usuario: {
                ...usuario._doc,
                productosCount,
                pedidosCount
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: 'Error al obtener detalles del usuario' });
    }
};