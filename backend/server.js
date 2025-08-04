require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const swagger = require('./src/middlewares/swagger')

const connectDB = require('./src/configs/database')
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();
swagger(app);

//Rutas
app.use('/estados', require('./src/routes/estadoRoutes'));
app.use('/mascotas', require('./src/routes/mascotaRoutes'));
app.use('/refugios', require('./src/routes/refugioRoutes'));
app.use('/seguimientos', require('./src/routes/seguimientoRoutes'));
app.use('/tiposMascotas', require('./src/routes/tipoMascotaRoutes'));
app.use('/solicitudes', require('./src/routes/solicitudAdopcionRoutes'));
app.use('/usuarios', require('./src/routes/usuarioRoutes'));
app.use('/visitas', require('./src/routes/visitaRoutes'));
app.use('/auth', require('./src/routes/authRoutes'));


app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// habilitar CORS para frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());