// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config(); // Cargar variables .env

const app = express();

// Importar rutas
const usuarioRoutes = require('./routes/usuario.routes');
const preguntaRoutes = require("./routes/pregunta.routes");

// Middleware para parsear JSON
app.use(express.json());

// CORS global - Permitir cualquier origen (¡sin credenciales!)
app.use(cors({
    origin: "*", // Permitir todos los orígenes
    methods: ["GET", "POST", "PUT", "DELETE"]
    // NOTA: No agregues credentials: true aquí
}));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB conectado"))
.catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Rutas principales
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/preguntas', preguntaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'API en Vercel funcionando! 🚀' });
});

// Exportar para Vercel
module.exports = app;
