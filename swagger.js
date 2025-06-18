// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Project API Documentation",
      version: "1.0.0",
    },
  },
  apis: ["./pages/api/**/*.js"], // Adjust if using TS
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
