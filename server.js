const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./conexion"); // Importar conexión
require("dotenv").config();

// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const preguntaRecuperacionRoutes = require('./routes/preguntaRecuperacionRoutes');

const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Conectar a la base de datos
connectDB();

// Endpoint raíz para pruebas
app.get("/", (req, res) => {
    res.send("🚀 API funcionando correctamente");
});

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/preguntas', preguntaRecuperacionRoutes);


// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
