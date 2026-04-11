import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import app from "../src/app.js";
import User from "../src/dao/models/User.js";
import { sessionsRepository } from "../src/repository/sessions.repository.js";
import { hashPassword } from "../src/utils/auth.utils.js";

const originalFindOne = User.findOne;
const originalFindById = User.findById;
const originalCreate = User.create;

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

afterEach(() => {
  User.findOne = originalFindOne;
  User.findById = originalFindById;
  User.create = originalCreate;
  sessionsRepository.clearAll();
});

test("POST /api/sessions/register registra usuario", async () => {
  const { server, baseUrl } = await startServer();

  const mockUser = {
    _id: "67f4f2a0fbb9f7e5f7afaa11",
    first_name: "Ada",
    last_name: "Lovelace",
    email: "ada@example.com",
    role: "user",
    toObject() {
      return { ...this, password: "hashed" };
    },
  };

  User.findOne = async () => null;
  User.create = async () => mockUser;

  try {
    const response = await fetch(`${baseUrl}/api/sessions/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: "Ada",
        last_name: "Lovelace",
        email: "ada@example.com",
        password: "coder123",
      }),
    });

    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.status, "success");
    assert.equal(body.payload.email, "ada@example.com");
    assert.equal(body.payload.password, undefined);
  } finally {
    await closeServer(server);
  }
});

test("POST /api/sessions/login + GET /api/sessions/current + POST /api/sessions/logout", async () => {
  const { server, baseUrl } = await startServer();
  const hashedPassword = await hashPassword("coder123");

  const user = {
    _id: "67f4f2a0fbb9f7e5f7afaa22",
    first_name: "Grace",
    last_name: "Hopper",
    email: "grace@example.com",
    password: hashedPassword,
    role: "admin",
    toObject() {
      return { ...this };
    },
  };

  User.findOne = async (query) => (query.email === user.email ? user : null);
  User.findById = async (id) => (id === user._id ? user : null);

  try {
    const loginResponse = await fetch(`${baseUrl}/api/sessions/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, password: "coder123" }),
    });

    const loginBody = await loginResponse.json();
    const token = loginBody.payload.token;

    assert.equal(loginResponse.status, 200);
    assert.equal(loginBody.status, "success");
    assert.equal(typeof token, "string");

    const currentResponse = await fetch(`${baseUrl}/api/sessions/current`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const currentBody = await currentResponse.json();

    assert.equal(currentResponse.status, 200);
    assert.equal(currentBody.payload.email, user.email);
    assert.equal(currentBody.payload.password, undefined);

    const logoutResponse = await fetch(`${baseUrl}/api/sessions/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const logoutBody = await logoutResponse.json();

    assert.equal(logoutResponse.status, 200);
    assert.equal(logoutBody.message, "Sesión cerrada correctamente");

    const currentAfterLogoutResponse = await fetch(
      `${baseUrl}/api/sessions/current`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    assert.equal(currentAfterLogoutResponse.status, 401);
  } finally {
    await closeServer(server);
  }
});
