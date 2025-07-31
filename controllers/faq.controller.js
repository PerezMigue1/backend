const FAQ = require('../models/faq.model');

// Obtener FAQs públicas (activas)
const obtenerFAQsPublicas = async (req, res) => {
    try {
        const faqs = await FAQ.find({ activo: true })
            .sort({ orden: 1, createdAt: -1 });

        res.json({
            success: true,
            data: faqs
        });
    } catch (error) {
        console.error('Error al obtener FAQs públicas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener FAQ por categoría (público)
const obtenerFAQPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        
        const faqs = await FAQ.find({ 
            categoria: categoria, 
            activo: true 
        }).sort({ orden: 1, createdAt: -1 });

        res.json({
            success: true,
            data: faqs
        });
    } catch (error) {
        console.error('Error al obtener FAQs por categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener todas las FAQs (admin)
const obtenerTodasFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find()
            .sort({ orden: 1, createdAt: -1 });

        res.json({
            success: true,
            data: faqs
        });
    } catch (error) {
        console.error('Error al obtener todas las FAQs:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Crear nueva FAQ (admin)
const crearFAQ = async (req, res) => {
    try {
        const { pregunta, respuesta, categoria, activo, orden } = req.body;

        const nuevaFAQ = new FAQ({
            pregunta,
            respuesta,
            categoria,
            activo: activo !== undefined ? activo : true,
            orden: orden || 0
        });

        const faqGuardada = await nuevaFAQ.save();

        res.status(201).json({
            success: true,
            data: faqGuardada,
            message: 'FAQ creada exitosamente'
        });
    } catch (error) {
        console.error('Error al crear FAQ:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar FAQ (admin)
const actualizarFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { pregunta, respuesta, categoria, activo, orden } = req.body;

        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'FAQ no encontrada'
            });
        }

        // Actualizar campos
        if (pregunta !== undefined) faq.pregunta = pregunta;
        if (respuesta !== undefined) faq.respuesta = respuesta;
        if (categoria !== undefined) faq.categoria = categoria;
        if (activo !== undefined) faq.activo = activo;
        if (orden !== undefined) faq.orden = orden;

        const faqActualizada = await faq.save();

        res.json({
            success: true,
            data: faqActualizada,
            message: 'FAQ actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar FAQ:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar FAQ (admin) - Soft delete
const eliminarFAQ = async (req, res) => {
    try {
        const { id } = req.params;

        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'FAQ no encontrada'
            });
        }

        // Soft delete - marcar como inactiva
        faq.activo = false;
        await faq.save();

        res.json({
            success: true,
            message: 'FAQ eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar FAQ:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    obtenerFAQsPublicas,
    obtenerFAQPorCategoria,
    obtenerTodasFAQs,
    crearFAQ,
    actualizarFAQ,
    eliminarFAQ
}; 