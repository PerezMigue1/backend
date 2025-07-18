//api/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

// Middleware base para verificar el token
const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // contiene { id, email, rol, etc. }
        next();
    } catch (error) {
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

const verificarRol = (rolPermitido) => {
    return (req, res, next) => {
        if (req.usuario.rol !== rolPermitido) {
            return res.status(403).json({ mensaje: "No autorizado" });
        }
        next();
    };
};

module.exports = {
    verificarToken,
    permitirRoles,
    verificarRol
};
