const swaggerJsDoc = require('swagger-jsdoc');

module.exports = swaggerJsDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sortlog Apis Documentation',
      version: '1.0.0',
    },
  },
  apis: ['controllers/*.js'],
});
