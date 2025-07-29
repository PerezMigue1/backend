//api/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

// Middleware base para verificar el token
const verificarToken = (req, res, next) => {
    console.log('🔍 Middleware verificarToken ejecutándose');
    console.log('🔍 Headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    console.log('🔍 Auth header:', authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log('❌ Token no proporcionado o formato incorrecto');
        return res.status(401).json({ mensaje: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    console.log('🔍 Token extraído:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔍 Token decodificado:', decoded);
        req.usuario = decoded; // contiene { id, email, rol, etc. }
        next();
    } catch (error) {
        console.log('❌ Error al verificar token:', error.message);
        return res.status(403).json({ mensaje: "Token inválido o expirado" });
    }
};

// Middleware adicional para permitir solo ciertos roles
const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                mensaje: "No tienes permiso para realizar esta acción"
            });
        }
        next();
    };
};

module.exports = {
    verificarToken,
    permitirRoles
};
