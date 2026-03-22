const docsJsonUrl = "/api/docs.json";

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Backend III API",
    version: "1.0.0",
    description:
      "Documentación de la API para usuarios, mascotas y adopciones.",
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Servidor local",
    },
  ],
  tags: [
    {
      name: "Users",
      description: "Operaciones del módulo de usuarios",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        required: ["first_name", "last_name", "email", "password"],
        properties: {
          _id: { type: "string", description: "Identificador de MongoDB" },
          first_name: { type: "string", example: "Ada" },
          last_name: { type: "string", example: "Lovelace" },
          email: {
            type: "string",
            format: "email",
            example: "ada@example.com",
          },
          password: { type: "string", example: "coder123" },
          role: { type: "string", enum: ["user", "admin"], example: "user" },
          pets: {
            type: "array",
            items: { type: "string" },
            example: [],
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateUserInput: {
        type: "object",
        required: ["first_name", "last_name", "email", "password"],
        properties: {
          first_name: { type: "string", example: "Ada" },
          last_name: { type: "string", example: "Lovelace" },
          email: {
            type: "string",
            format: "email",
            example: "ada@example.com",
          },
          password: { type: "string", example: "coder123" },
          role: { type: "string", enum: ["user", "admin"], example: "user" },
        },
      },
      UpdateUserInput: {
        type: "object",
        properties: {
          first_name: { type: "string" },
          last_name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
          role: { type: "string", enum: ["user", "admin"] },
          pets: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
      ApiUsersListResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          payload: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
        },
      },
      ApiUserResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          payload: { $ref: "#/components/schemas/User" },
        },
      },
      ApiMessageResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          message: {
            type: "string",
            example: "Operación realizada correctamente",
          },
        },
      },
      ApiErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string", example: "Descripción del error" },
        },
      },
    },
  },
  paths: {
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Obtiene todos los usuarios",
        responses: {
          200: {
            description: "Lista de usuarios obtenida correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiUsersListResponse" },
              },
            },
          },
          500: {
            description: "Error interno del servidor",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Crea un usuario nuevo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Usuario creado correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiUserResponse" },
              },
            },
          },
          400: {
            description: "Datos incompletos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/users/{uid}": {
      get: {
        tags: ["Users"],
        summary: "Obtiene un usuario por id",
        parameters: [
          {
            in: "path",
            name: "uid",
            required: true,
            schema: { type: "string" },
            description: "Id del usuario",
          },
        ],
        responses: {
          200: {
            description: "Usuario encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiUserResponse" },
              },
            },
          },
          400: {
            description: "Id inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiErrorResponse" },
              },
            },
          },
          404: {
            description: "Usuario no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Actualiza un usuario",
        parameters: [
          {
            in: "path",
            name: "uid",
            required: true,
            schema: { type: "string" },
            description: "Id del usuario",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Usuario actualizado correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiUserResponse" },
              },
            },
          },
          400: {
            description: "Id inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiErrorResponse" },
              },
            },
          },
          404: {
            description: "Usuario no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Elimina un usuario",
        parameters: [
          {
            in: "path",
            name: "uid",
            required: true,
            schema: { type: "string" },
            description: "Id del usuario",
          },
        ],
        responses: {
          200: {
            description: "Usuario eliminado correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiMessageResponse" },
              },
            },
          },
          400: {
            description: "Id inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiErrorResponse" },
              },
            },
          },
          404: {
            description: "Usuario no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};

export const swaggerHtml = [
  "<!DOCTYPE html>",
  '<html lang="es">',
  "  <head>",
  '    <meta charset="UTF-8" />',
  '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  "    <title>Backend III Docs</title>",
  '    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />',
  "  </head>",
  "  <body>",
  '    <div id="swagger-ui"></div>',
  '    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>',
  "    <script>",
  '      window.ui = SwaggerUIBundle({ url: "' +
    docsJsonUrl +
    '", dom_id: "#swagger-ui" });',
  "    </script>",
  "  </body>",
  "</html>",
].join("\n");
