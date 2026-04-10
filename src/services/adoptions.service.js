import mongoose from "mongoose";
import { adoptionsRepository } from "../repository/adoptions.repository.js";
import { usersRepository } from "../repository/users.repository.js";
import { petsRepository } from "../repository/pets.repository.js";

export const adoptionsService = {
  getAll: () => adoptionsRepository.findAll(),
  getById: async (aid) => {
    if (!mongoose.Types.ObjectId.isValid(aid)) {
      return { error: "El id de la adopción no es válido", code: 400 };
    }

    const adoption = await adoptionsRepository.findById(aid);

    if (!adoption) {
      return { error: "Adopción no encontrada", code: 404 };
    }

    return { data: adoption };
  },
  create: async (uid, pid) => {
    if (
      !mongoose.Types.ObjectId.isValid(uid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      return {
        error: "Los ids del usuario y la mascota deben ser válidos",
        code: 400,
      };
    }

    const [user, pet] = await Promise.all([
      usersRepository.findById(uid),
      petsRepository.findById(pid),
    ]);

    if (!user) {
      return { error: "Usuario no encontrado", code: 404 };
    }

    if (!pet) {
      return { error: "Mascota no encontrada", code: 404 };
    }

    if (pet.adopted) {
      return { error: "La mascota ya se encuentra adoptada", code: 409 };
    }

    pet.adopted = true;
    pet.owner = user._id;
    user.pets = [...(user.pets ?? []), pet._id];

    const adoption = await adoptionsRepository.create({
      owner: user._id,
      pet: pet._id,
    });

    await Promise.all([pet.save(), user.save()]);

    return {
      data: adoption,
      code: 201,
      message: "Adopción registrada correctamente",
    };
  },
};
