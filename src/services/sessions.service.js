import mongoose from "mongoose";
import { usersRepository } from "../repository/users.repository.js";
import { sessionsRepository } from "../repository/sessions.repository.js";
import {
  generateSessionToken,
  hashPassword,
  sanitizeUser,
  verifyPassword,
} from "../utils/auth.utils.js";

export const sessionsService = {
  register: async ({ first_name, last_name, email, password, role }) => {
    if (!first_name || !last_name || !email || !password) {
      return {
        error: "Nombre, Apellido, email y contraseña son obligatorios",
        code: 400,
      };
    }

    const existingUser = await usersRepository.findByEmail(email);

    if (existingUser) {
      return { error: "El email ya está registrado", code: 409 };
    }

    const hashedPassword = await hashPassword(password);

    const user = await usersRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
    });

    return { data: sanitizeUser(user), code: 201 };
  },

  login: async ({ email, password }) => {
    if (!email || !password) {
      return { error: "Email y contraseña son obligatorios", code: 400 };
    }

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      return { error: "Credenciales inválidas", code: 401 };
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return { error: "Credenciales inválidas", code: 401 };
    }

    const token = generateSessionToken();
    sessionsRepository.createSession(token, user._id);

    return {
      data: {
        token,
        user: sanitizeUser(user),
      },
    };
  },

  current: async (authorizationHeader) => {
    if (!authorizationHeader?.startsWith("Bearer ")) {
      return { error: "Token no provisto", code: 401 };
    }

    const token = authorizationHeader.replace("Bearer ", "").trim();
    const userId = sessionsRepository.getUserIdByToken(token);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return { error: "Sesión inválida", code: 401 };
    }

    const user = await usersRepository.findById(userId);

    if (!user) {
      return { error: "Sesión inválida", code: 401 };
    }

    return { data: sanitizeUser(user) };
  },

  logout: (authorizationHeader) => {
    if (!authorizationHeader?.startsWith("Bearer ")) {
      return { error: "Token no provisto", code: 401 };
    }

    const token = authorizationHeader.replace("Bearer ", "").trim();
    const deleted = sessionsRepository.deleteSession(token);

    if (!deleted) {
      return { error: "Sesión inválida", code: 401 };
    }

    return { data: { message: "Sesión cerrada correctamente" } };
  },
};
