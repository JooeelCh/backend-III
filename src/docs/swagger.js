import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend III API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routers/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
