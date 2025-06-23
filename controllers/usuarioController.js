const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

exports.crearUsuario = async (req, res) => {
    try {
        const {
            nombre, telefono, email, password,
            sexo, edad,
            recuperacion, // { pregunta: ObjectId, respuesta: string }
            rol
        } = req.body;

        if (!nombre || !telefono || !email || !password || !sexo || !edad || !recuperacion?.pregunta || !recuperacion?.respuesta) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        const existe = await Usuario.findOne({ email });
        if (existe) return res.status(400).json({ message: "El email ya está registrado" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({
            nombre,
            telefono,
            email,
            password: hashedPassword,
            sexo,
            edad,
            recuperacion,
            rol
        });

        await nuevoUsuario.save();
        res.status(201).json({ message: "Usuario creado correctamente", usuario: nuevoUsuario });

    } catch (error) {
        console.error("❌ Error al crear usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

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

        res.json({ message: "Inicio de sesión exitoso", usuario });
    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Paso 1: Obtener pregunta de seguridad por email
exports.obtenerPreguntaRecuperacion = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Email recibido:", email);
        
        // Elimina el populate ya que pregunta es un string directo
        const usuario = await Usuario.findOne({ email });
        console.log("Usuario encontrado:", usuario);
        
        if (!usuario) {
            return res.status(404).json({ message: "Correo no encontrado" });
        }

        console.log("Pregunta obtenida:", usuario.recuperacion.pregunta);
        
        res.json({ 
            pregunta: usuario.recuperacion.pregunta // Accede directamente al string
        });
    } catch (error) {
        console.error("Error completo:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Paso 2: Validar respuesta de seguridad
exports.validarRespuestaRecuperacion = async (req, res) => {
    try {
        const { email, respuesta } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).json({ message: "Correo no encontrado" });
        }

        // Comparación de respuestas
        const respuestaCorrecta = usuario.recuperacion.respuesta.toLowerCase().trim();
        const respuestaUsuario = respuesta.toLowerCase().trim();

        if (respuestaCorrecta !== respuestaUsuario) {
            return res.status(401).json({ 
                message: "Respuesta incorrecta",
                pregunta: usuario.recuperacion.pregunta
            });
        }

        // Generar token (válido por 15 minutos)
        const token = require('crypto').randomBytes(32).toString('hex');
        usuario.resetPasswordToken = token;
        usuario.resetPasswordExpires = Date.now() + 900000; // 15 minutos
        await usuario.save();

        res.json({ 
            success: true,
            token: token,
            email: usuario.email
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Paso 3: Cambiar contraseña con token válido
exports.cambiarPassword = async (req, res) => {
    try {
        const { email, token, nuevaPassword } = req.body;
        const usuario = await Usuario.findOne({ 
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ 
                message: "Token inválido o expirado" 
            });
        }

        // Actualizar contraseña
        usuario.password = await bcrypt.hash(nuevaPassword, 10);
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;
        await usuario.save();

        res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

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

        res.json({ message: "Usuario actualizado", usuario: usuarioActualizado });
    } catch (error) {
        console.error("❌ Error al actualizar:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

        if (!usuarioEliminado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario eliminado", usuario: usuarioEliminado });
    } catch (error) {
        console.error("❌ Error al eliminar:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};