import mongoose from "mongoose";
import { usersRepository } from "../repository/users.repository.js";
import { hashPassword, sanitizeUser } from "../utils/auth.utils.js";

export const usersService = {
  getAll: async () => {
    const users = await usersRepository.findAll();
    return { data: users.map(sanitizeUser) };
  },

  getById: async (uid) => {
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return { error: "El id del usuario no es válido", code: 400 };
    }

    const user = await usersRepository.findById(uid);

    if (!user) {
      return { error: "Usuario no encontrado", code: 404 };
    }

    return { data: sanitizeUser(user) };
  },

  create: async (payload) => {
    const { first_name, last_name, email, password, role } = payload;

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

  update: async (uid, payload) => {
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return { error: "El id del usuario no es válido", code: 400 };
    }

    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }

    const user = await usersRepository.updateById(uid, payload);

    if (!user) {
      return { error: "Usuario no encontrado", code: 404 };
    }

    return { data: sanitizeUser(user) };
  },

  delete: async (uid) => {
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return { error: "El id del usuario no es válido", code: 400 };
    }

    const user = await usersRepository.deleteById(uid);

    if (!user) {
      return { error: "Usuario no encontrado", code: 404 };
    }

    return { data: { message: "Usuario eliminado correctamente" } };
  },
};
