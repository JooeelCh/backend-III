import mongoose from "mongoose";
import { usersRepository } from "../repository/users.repository.js";
import {
  generateJWT,
  hashPassword,
  sanitizeUser,
  verifyPassword,
  verifyJWT,
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

    const token = generateJWT(user);

    return {
      data: {
        token,
        user: sanitizeUser(user),
      },
    };
  },

  current: async (userData) => {
    if (!userData?.id) {
      return { error: "Token inválido", code: 401 };
    }

    if (!mongoose.Types.ObjectId.isValid(userData.id)) {
      return { error: "Token inválido", code: 401 };
    }

    const user = await usersRepository.findById(userData.id);

    if (!user) {
      return { error: "Usuario no encontrado", code: 404 };
    }

    return { data: sanitizeUser(user) };
  },

  logout: () => {
    return { data: { message: "Logout correcto" } };
  },
};
