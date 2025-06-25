// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // si quieres usar .env local

const app = express();

// Importar rutas
const usuarioRoutes = require('./routes/usuario.routes');
//const preguntaRecuperacionRoutes = require('./routes/preguntaRecuperacionRoutes');

// Middlewares
app.use(express.json());

// Configurar CORS
const allowedOrigins = [process.env.FRONTEND_URL];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Rutas
app.use('/api/usuarios', usuarioRoutes);
//app.use('/api/preguntas', preguntaRecuperacionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'API en Vercel funcionando! 🚀' });
});

// Exportar app para que Vercel lo use como función serverless
module.exports = app;
