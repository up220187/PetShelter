const mongoose = require('mongoose');
const databaseErrorHandler = require('../middlewares/databaseErrorHandler')
require('dotenv').config();

const connectDB = async (app) => {
    const dbConnection = process.env.MONGODB_URI || 'mongodb://localhost:27017/Pet_Shelter';

    try {
        await mongoose.connect(dbConnection);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);


        app.use((req, res, next) => databaseErrorHandler(error, req, res, next));

        process.exit(1);
    }
};

module.exports = connectDB;