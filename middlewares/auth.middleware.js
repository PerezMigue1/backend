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
        console.log('🔍 JWT_SECRET disponible:', !!process.env.JWT_SECRET);
        console.log('🔍 JWT_SECRET longitud:', process.env.JWT_SECRET?.length);
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔍 Token decodificado:', decoded);
        req.usuario = decoded; // contiene { id, email, rol, etc. }
        console.log('🔍 Usuario asignado a req.usuario:', req.usuario);
        next();
    } catch (error) {
        console.log('❌ Error al verificar token:', error.message);
        console.log('❌ Tipo de error:', error.name);
        console.log('❌ JWT_SECRET disponible:', !!process.env.JWT_SECRET);
        return res.status(403).json({ mensaje: "Token inválido o expirado" });
    }
};

// Middleware adicional para permitir solo ciertos roles
const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        console.log('🔍 Verificando roles:', req.usuario.rol);
        console.log('🔍 Roles permitidos:', rolesPermitidos);
        
        // Verificar si el usuario tiene al menos uno de los roles permitidos
        const tieneRolPermitido = Array.isArray(req.usuario.rol) 
            ? req.usuario.rol.some(rol => rolesPermitidos.includes(rol))
            : rolesPermitidos.includes(req.usuario.rol);
            
        console.log('🔍 ¿Tiene rol permitido?:', tieneRolPermitido);
        
        if (!tieneRolPermitido) {
            return res.status(403).json({
                mensaje: "No tienes permiso para realizar esta acción"
            });
        }
        next();
    };
};

// Middleware específico para verificar si es admin
const verificarAdmin = (req, res, next) => {
    console.log('🔍 Middleware verificarAdmin ejecutándose');
    console.log('🔍 Usuario:', req.usuario);
    
    if (!req.usuario) {
        return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }
    
    // Verificar si el usuario es admin
    const esAdmin = Array.isArray(req.usuario.rol) 
        ? req.usuario.rol.includes('admin')
        : req.usuario.rol === 'admin';
        
    console.log('🔍 ¿Es admin?:', esAdmin);
    
    if (!esAdmin) {
        return res.status(403).json({
            mensaje: "Se requieren permisos de administrador"
        });
    }
    
    next();
};

module.exports = {
    verificarToken,
    permitirRoles,
    verificarAdmin
};
