const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Port de Plaisance Russell',
      version: '1.0.0',
      description: "API de gestion des catways, réservations et utilisateurs du port de plaisance de Russell.",
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./app.js', './src/routes/*.js'],
};

module.exports = swaggerJSDoc(options);