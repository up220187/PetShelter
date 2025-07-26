const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const hostname = 'localhost';

app.use(express.json());

//Rutas
app.use('/estados', require('./src/routes/estadoRoutes'));
app.use('/mascotas', require('./src/routes/mascotaRoutes'));
app.use('/refugios', require('./src/routes/refugioRoutes'));
app.use('/seguimientos', require('./src/routes/seguimientoRoutes'));

app.listen(3000, () => {
    console.log(`Servidor corriendo en http://${hostname}:${port}`);
});