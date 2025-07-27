const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PetShelter API',
            version: '1.0.0',
            description: 'API para el proyecto PetShelter',
        },
        servers: [
            {
                url: process.env.SWAGGER_SERVER_URL || 'http://localhost:3000/api-docs',
            },
        ],
        components : {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security : [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js', './src/models/*.js'],
};

const swaggerDocs = swaggerJsDoc(options);

module.exports = swaggerDocs;