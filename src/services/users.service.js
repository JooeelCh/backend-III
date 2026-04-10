import mongoose from "mongoose";
import { usersRepository } from "../repository/users.repository.js";

export const usersService = {
  getAll: () => usersRepository.findAll(),
  getById: async (uid) => {
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return { error: "El id del usuario no es válido", code: 400 };
    }

    const user = await usersRepository.findById(uid);

    if (!user) {
      return { error: "Usuario no encontrado", code: 404 };
    }

    return { data: user };
  },
  create: async (payload) => {
    const { first_name, last_name, email, password } = payload;

    if (!first_name || !last_name || !email || !password) {
      return {
        error: "first_name, last_name, email y password son obligatorios",
        code: 400,
      };
    }

    const user = await usersRepository.create(payload);
    return { data: user, code: 201 };
  },
  update: async (uid, payload) => {
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return { error: "El id del usuario no es válido", code: 400 };
    }

    const user = await usersRepository.updateById(uid, payload);

    if (!user) {
      return { error: "Usuario no encontrado", code: 404 };
    }

    return { data: user };
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
