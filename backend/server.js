const express = require('express');

const swagger = require('./src/middlewares/swagger')

const connectDB = require('./src/configs/database')
const app = express();
const port = 3000;
const hostname = 'localhost';

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


app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});


app.listen(3000, () => {
    console.log(`Servidor corriendo en http://${hostname}:${port}`);
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de error general
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});