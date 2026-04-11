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

    git clone https://github.com/JooeelCh/backend-III
    cd backend-III

Instalar las dependencias del proyecto

    npm install

Correr el proyecto en modo de desarrollo

    npm run dev

---

## EJECUCION EN DOCKER

Construir la imagen de Docker

    docker build -t adoptme .

Ejecutar el contenedor

    docker run -p 8080:8080 adoptme

Ejecutar con Docker Hub

    docker pull joelch02/adoptme
    docker run -p 8080:8080 joelch02/adoptme

Ejecutar con Docker Compose

    docker compose up --build
    docker-compose up --build

---

## VARIABLES DE ENTORNO

Crear el archivo .env basado en .env.example

    1. PORT=8080
    2. MONGO_URI=mongodb://localhost:27017/adoptme
    3. JWT_SECRET=secretkey

---

## ENDPOINTS DISPONIBLES

Users

    1. Obtener usuarios: GET http://localhost:8080/api/users
    2. Obtener usuario por ID: GET http://localhost:8080/api/users/:uid
    3. Crear usuario: POST http://localhost:8080/api/users
    4. Actualizar usuario: PUT http://localhost:8080/api/users/:uid
    5. Eliminar usuario: DELETE http://localhost:8080/api/users/:uid

Pets

    1. Obtener mascotas: GET http://localhost:8080/api/pets
    2. Obtener mascota por ID: GET http://localhost:8080/api/pets/:pid
    3. Actualizar mascota: PUT http://localhost:8080/api/pets/:pid
    4. Eliminar mascota: DELTE http://localhost:8080/api/pets/:pid

Adoptions

    1. Obtener adopciones: GET http://localhost:8080/api/adoptions
    2. Obtener adopciones por ID: GET http://localhost:8080/api/adoptions/:aid
    3. Adoptar mascota: POST http://localhost:8080/api/adoptions/:uid/:pid

Sessions

    1. Registro: POST http://localhost:8080/api/sessions/register
    2. Iniciar sesion: POST http://localhost:8080/api/sessions/login
    3. Sesion activa: GET http://localhost:8080/api/sessions/current
    4. Cerrar sesions: POST http://localhost:8080/api/sessions/logout

## TESTS

Ejecutar los tests

    1. npm test
