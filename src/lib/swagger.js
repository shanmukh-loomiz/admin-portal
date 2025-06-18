// lib/swagger.js
export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Project API",
      version: "1.0.0",
    },
  },
  apis: ["./src/app/api/**/*.js"], // or **/*.ts if you're using TS
};
