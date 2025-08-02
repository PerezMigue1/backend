const mongoose = require("mongoose");

const NegocioSchema = new mongoose.Schema({
    Nombre: { type: String, required: true },
    Categoria: { 
        type: String, 
        required: true,
        enum: [
            'Restaurantes', 'Hoteles', 'Tiendas', 'Servicios', 'Entretenimiento', 'Salud', 'Educación', 'Transporte',
            'Gastronomía', 'Hospedaje', 'Comercio', 'Turismo', 'Artesanías', 'Cafeterías', 'Bares', 'Farmacias',
            'Gasolineras', 'Bancos', 'Oficinas', 'Talleres', 'Estéticas', 'Gimnasios', 'Museos', 'Teatros', 'Cines',
            'Parques', 'Iglesias', 'Escuelas', 'Universidades', 'Hospitales', 'Clínicas', 'Dentistas', 'Veterinarias',
            'Lavanderías', 'Peluquerías', 'Tintorerías', 'Papelerías', 'Librerías', 'Joyerías', 'Ópticas', 'Zapaterías',
            'Ropa', 'Electrónicos', 'Mueblerías', 'Ferreterías', 'Viveros', 'Mascotas', 'Deportes', 'Música',
            'Fotografía', 'Viajes', 'Seguros', 'Abogados', 'Contadores', 'Arquitectos', 'Ingenieros', 'Diseñadores',
            'Programadores', 'Otros'
        ]
    },
    Descripcion: { type: String },
    
    Ubicacion: {
        Estado: { type: String },
        Municipio: { type: String },
        Coordenadas: {
            lat: { type: Number },
            lng: { type: Number }
        },
        Direccion: { type: String }
    },
    
    RedesSociales: {
        Facebook: { type: String },
        Instagram: { type: String },
        WhatsApp: { type: String }
    },
    
    Promociones: { type: String },
    
    Reseñas: [
        {
            Usuario: { type: String },
            Comentario: { type: String },
            Calificacion: { type: Number }
        }
    ],
    
    Imagenes: [{ type: String }],
    
    Horario: { type: String },
    Contacto: { type: String },
    Recomendado: { type: Boolean, default: false }
    
}, { timestamps: true });

module.exports = mongoose.model("Negocio", NegocioSchema, "negocio");