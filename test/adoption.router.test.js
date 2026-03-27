import assert from "node:assert/strict";
import mongoose from "mongoose";
import test, { afterEach } from "node:test";
import app from "../src/app.js";
import Adoption from "../src/models/Adoption.js";
import User from "../src/models/User.js";
import Pet from "../src/models/Pet.js";

const originalFind = Adoption.find;
const originalFindById = Adoption.findById;
const originalCreate = Adoption.create;
const originalUserFindById = User.findById;
const originalPetFindById = Pet.findById;

const startServer = async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  return {
    server,
    baseUrl: `http://127.0.0.1:${port}`,
  };
};

const closeServer = (server) => new Promise((resolve) => server.close(resolve));

const restoreModelMethods = () => {
  Adoption.find = originalFind;
  Adoption.findById = originalFindById;
  Adoption.create = originalCreate;
  User.findById = originalUserFindById;
  Pet.findById = originalPetFindById;
};

afterEach(() => {
  restoreModelMethods();
});

test("GET /api/adoptions devuelve todas las adopciones", async () => {
  const { server, baseUrl } = await startServer();
  const adoptions = [
    {
      _id: new mongoose.Types.ObjectId().toString(),
      owner: {
        _id: new mongoose.Types.ObjectId().toString(),
        first_name: "Ada",
      },
      pet: { _id: new mongoose.Types.ObjectId().toString(), name: "Milo" },
    },
  ];

  Adoption.find = () => ({
    populate: async () => adoptions,
  });

  try {
    const response = await fetch(`${baseUrl}/api/adoptions`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, "success");
    assert.deepEqual(body.payload, adoptions);
  } finally {
    await closeServer(server);
  }
});

test("GET /api/adoptions/:aid devuelve 400 si el id es inválido", async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await fetch(`${baseUrl}/api/adoptions/id-invalido`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.message, "El ID de la adopcion no es valido");
  } finally {
    await closeServer(server);
  }
});

test("GET /api/adoptions/:aid devuelve 404 si la adopción no existe", async () => {
  const { server, baseUrl } = await startServer();
  const adoptionId = new mongoose.Types.ObjectId().toString();

  Adoption.findById = () => ({
    populate: async () => null,
  });

  try {
    const response = await fetch(`${baseUrl}/api/adoptions/${adoptionId}`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.message, "Adopcion no encontrada");
  } finally {
    await closeServer(server);
  }
});

test("GET /api/adoptions/:aid devuelve la adopción solicitada", async () => {
  const { server, baseUrl } = await startServer();
  const adoptionId = new mongoose.Types.ObjectId().toString();
  const adoption = {
    _id: adoptionId,
    owner: {
      _id: new mongoose.Types.ObjectId().toString(),
      first_name: "Grace",
    },
    pet: { _id: new mongoose.Types.ObjectId().toString(), name: "Luna" },
  };

  Adoption.findById = () => ({
    populate: async () => adoption,
  });

  try {
    const response = await fetch(`${baseUrl}/api/adoptions/${adoptionId}`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, "success");
    assert.deepEqual(body.payload, adoption);
  } finally {
    await closeServer(server);
  }
});

test("POST /api/adoptions/:uid/:pid crea una adopción", async () => {
  const { server, baseUrl } = await startServer();
  const userId = new mongoose.Types.ObjectId();
  const petId = new mongoose.Types.ObjectId();
  const adoptionId = new mongoose.Types.ObjectId().toString();

  const user = {
    _id: userId,
    pets: [],
    save: async function save() {
      return this;
    },
  };

  const pet = {
    _id: petId,
    adopted: false,
    owner: null,
    save: async function save() {
      return this;
    },
  };

  User.findById = async (id) => (id === userId.toString() ? user : null);
  Pet.findById = async (id) => (id === petId.toString() ? pet : null);
  Adoption.create = async ({ owner, pet: adoptionPet }) => ({
    _id: adoptionId,
    owner,
    pet: adoptionPet,
  });

  try {
    const response = await fetch(
      `${baseUrl}/api/adoptions/${userId}/${petId}`,
      {
        method: "POST",
      },
    );
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.status, "success");
    assert.equal(body.message, "Adopcion registrada correctamente");
    assert.equal(body.payload._id, adoptionId);
    assert.equal(String(pet.owner), userId.toString());
    assert.equal(pet.adopted, true);
    assert.deepEqual(user.pets.map(String), [petId.toString()]);
  } finally {
    await closeServer(server);
  }
});

test("POST /api/adoptions/:uid/:pid devuelve 404 si el usuario no existe", async () => {
  const { server, baseUrl } = await startServer();
  const userId = new mongoose.Types.ObjectId();
  const petId = new mongoose.Types.ObjectId();

  User.findById = async () => null;
  Pet.findById = async () => ({ _id: petId, adopted: false });

  try {
    const response = await fetch(
      `${baseUrl}/api/adoptions/${userId}/${petId}`,
      {
        method: "POST",
      },
    );
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.message, "Usuario no encontrado");
  } finally {
    await closeServer(server);
  }
});

test("POST /api/adoptions/:uid/:pid devuelve 404 si la mascota no existe", async () => {
  const { server, baseUrl } = await startServer();
  const userId = new mongoose.Types.ObjectId();
  const petId = new mongoose.Types.ObjectId();

  User.findById = async () => ({
    _id: userId,
    pets: [],
    save: async function save() {
      return this;
    },
  });
  Pet.findById = async () => null;

  try {
    const response = await fetch(
      `${baseUrl}/api/adoptions/${userId}/${petId}`,
      {
        method: "POST",
      },
    );
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.message, "Mascota no encontrada");
  } finally {
    await closeServer(server);
  }
});

test("POST /api/adoptions/:uid/:pid devuelve 409 si la mascota ya fue adoptada", async () => {
  const { server, baseUrl } = await startServer();
  const userId = new mongoose.Types.ObjectId();
  const petId = new mongoose.Types.ObjectId();

  User.findById = async () => ({
    _id: userId,
    pets: [],
    save: async function save() {
      return this;
    },
  });
  Pet.findById = async () => ({ _id: petId, adopted: true });

  try {
    const response = await fetch(
      `${baseUrl}/api/adoptions/${userId}/${petId}`,
      {
        method: "POST",
      },
    );
    const body = await response.json();

    assert.equal(response.status, 409);
    assert.equal(body.message, "La mascota ya se encuentra adoptada");
  } finally {
    await closeServer(server);
  }
});

test("POST /api/adoptions/:uid/:pid devuelve 400 si algún id es inválido", async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await fetch(
      `${baseUrl}/api/adoptions/id-usuario/id-mascota`,
      {
        method: "POST",
      },
    );
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(
      body.message,
      "El ID del usuario y la mascota deben ser validos",
    );
  } finally {
    await closeServer(server);
  }
});
