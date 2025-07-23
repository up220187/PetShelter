const express = require('express');


const app = express();
const port = 3000;
const hostname = 'localhost';

app.listen(3000, () => {
    console.log(`Servidor corriendo en http://${hostname}:${port}`);
});