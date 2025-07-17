// middlewares/admin.middleware.js
module.exports = (req, res, next) => {
    if (req.userData && req.userData.rol === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: 'Acceso no autorizado. Se requiere rol de administrador'
        });
    }
};