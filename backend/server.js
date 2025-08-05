require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const swagger = require('./src/middlewares/swagger')
const connectDB = require('./src/configs/database')
const app = express();
const PORT = process.env.PORT || 3000;



connectDB();
swagger(app);

// Aplica CORS antes de cualquier ruta
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3001",
  credentials: true
}));

// Middleware JSON
app.use(express.json());

//Rutas
app.use('/mascotas', require('./src/routes/mascotaRoutes'));
app.use('/refugios', require('./src/routes/refugioRoutes'));
app.use('/seguimientos', require('./src/routes/seguimientoRoutes'));
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

