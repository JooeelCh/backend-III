import mongoose from "mongoose";
import { petsRepository } from "../repository/pets.repository.js";

export const petsService = {
  getAll: () => petsRepository.findAll(),

  getById: async (pid) => {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return { error: "El id de la mascota no es válido", code: 400 };
    }

    const pet = await petsRepository.findById(pid);

    if (!pet) {
      return { error: "Mascota no encontrado", code: 404 };
    }

    return { data: pet };
  },

  create: async (payload) => {
    const { name, species, age } = payload;

    if (!name || !species || age === undefined) {
      return { error: "Nombre, Especie y Edad son obligatorios", code: 400 };
    }

    const pet = await petsRepository.create(payload);
    return { data: pet, code: 201 };
  },
  update: async (pid, payload) => {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return { error: "El id de la mascota no es válido", code: 400 };
    }

    const pet = await petsRepository.updateById(pid, payload);

    if (!pet) {
      return { error: "Mascota no encontrada", code: 404 };
    }

    return { data: pet };
  },
  delete: async (pid) => {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return { error: "El id de la mascota no es válido", code: 400 };
    }

    const pet = await petsRepository.deleteById(pid);

    if (!pet) {
      return { error: "Mascota no encontrada", code: 404 };
    }

    return { data: pet };
  },
};
