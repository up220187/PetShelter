const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../configs/swaggerOptions');

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}