// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB conectado"))
.catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Rutas
app.use('/api/usuarios', require('./routes/usuario.routes'));
app.use('/api/preguntas', require('./routes/pregunta.routes'));
app.use('/api/productos', require('./routes/producto.routes')); 
app.use('/api/categoriaProducto', require('./routes/categoriaProducto.routes'));
app.use('/api/pedidos', require('./routes/pedido.route'));
app.use('/api/hospedaje', require('./routes/hospedaje.routes'));

// Ruta de prueba
app.get('/api', (req, res) => {
    res.send({ mensaje: 'API funcionando desde Vercel' });
});

// Exporta como función serverless
module.exports = serverless(app);


// Iniciar servidor (solo en desarrollo local)
const port = process.env.PORT || 3001;
if (require.main === module) {
    app.listen(port, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
}