const mongoose = require('mongoose');

const LugarTuristicoSchema = new mongoose.Schema({
    Nombre: { type: String, required: true },
    Imagen: [{ type: String }],
    Descripcion: { type: String },
    Horarios: { type: String },
    Costo: { type: String },
    NivelDeDificultad: { type: String },
    Categoria: { 
        type: String, 
        required: true,
        enum: [
            'Cascadas', 'Ríos', 'Montañas', 'Cuevas', 'Sitios Históricos', 'Miradores', 'Parques', 'Museos',
            'Iglesias', 'Plazas', 'Monumentos', 'Ruinas Arqueológicas', 'Lagos', 'Playas', 'Bosques', 'Selva',
            'Desierto', 'Volcanes', 'Aguas Termales', 'Balnearios', 'Jardines', 'Zoológicos', 'Acuarios',
            'Planetarios', 'Observatorios', 'Teatros', 'Auditorios', 'Centros Culturales', 'Bibliotecas',
            'Archivos Históricos', 'Fortalezas', 'Castillos', 'Haciendas', 'Pueblos Mágicos', 'Barrios Históricos',
            'Calles Peatonales', 'Mercados Tradicionales', 'Templos', 'Santuario', 'Capillas', 'Conventos',
            'Cementerios Históricos', 'Puentes Históricos', 'Acueductos', 'Torres', 'Faro', 'Puertos',
            'Estaciones de Tren', 'Aeropuertos', 'Terminales de Autobús', 'Centros Comerciales', 'Galerías de Arte',
            'Talleres Artesanales', 'Fábricas Históricas', 'Mineras', 'Plantaciones', 'Viñedos', 'Otros'
        ]
    },
    LinkEducativos: [{ type: String }],
    Ubicacion: {
        Estado: { type: String },
        Municipio: { type: String },
        Coordenadas: {
            lat: { type: Number },
            lng: { type: Number }
        }
    }
});

module.exports = mongoose.model('LugarTuristico', LugarTuristicoSchema, 'lugarTuristico');