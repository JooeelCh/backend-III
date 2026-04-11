# ADOPTME API - BACKEND III

Entrega final del curso backend III simulando una API de adopción de mascotas.

---

## FUNCIONALIDADES

1. Gestión de usuarios.
2. Gestión de mascotas.
3. Registro de adopciones.
4. Sistema de sesiones.

---

## DOCUMENTACION DE API

Swagger disponible en: http://localhost:8080/api/docs

---

## DOCKER HUB

Imagen disponible en: https://hub.docker.com/r/joelch02/adoptme

---

## EJECUCION DEL PROYECTO

Clonar el repositorio de GitHub

    1. git clone https://github.com/JooeelCh/backend-III
    2. cd backend-III

Instalar las dependencias del proyecto

    3. npm install

Correr el proyecto en modo de desarrollo

    4. npm run dev

---

## EJECUCION EN DOCKER

Construir la imagen de Docker

    1. docker build -t adoptme .

Ejecutar el contenedor

    2. docker run -p 8080:8080 adoptme

Ejecutar con Docker Hub

    3. docker pull joelch02/adoptme
    4. docker run -p 8080:8080 joelch02/adoptme

Ejecutar con Docker Compose

    5. docker compose up --build
    5.1. docker-compose up --build

---

## VARIABLES DE ENTORNO

Crear el archivo .env basado en .env.example

    1. PORT=8080
    2. MONGO_URI=mongodb://localhost:27017/adoptme
    3. JWT_SECRET=secretkey

---

## TESTS

Ejecutar los tests

    1. npm test
