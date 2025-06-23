const express = require('express');
const app = express();
const apiRoutes = require('../routes/api');

app.use(express.json());
app.use('/api', apiRoutes);

const { createServer } = require('@vercel/node');
module.exports = createServer(app);