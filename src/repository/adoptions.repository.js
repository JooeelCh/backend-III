import Adoption from "../dao/models/Adoption.js";

export const adoptionsRepository = {
  findAll: () => Adoption.find().populate("owner pet"),
  findById: (id) => Adoption.findById(id).populate("owner pet"),
  create: (payload) => Adoption.create(payload),
};
