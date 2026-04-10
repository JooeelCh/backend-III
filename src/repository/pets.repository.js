import Pet from "../dao/models/Pet.js";

export const petsRepository = {
  findAll: () => Pet.find(),
  findById: (id) => Pet.findById(id),
  create: (payload) => Pet.create(payload),
  updateById: (id, payload) =>
    Pet.findByIdAndUpdate(id, payload, { new: true, runValidators: true }),
  insertMany: (payload) => Pet.insertMany(payload),
};
