import User from "../dao/models/User.js";

export const usersRepository = {
  findAll: () => User.find(),
  findById: (id) => User.findById(id),
  findByEmail: (email) => User.findOne({ email }),
  create: (payload) => User.create(payload),
  updateById: (id, payload) =>
    User.findByIdAndUpdate(id, payload, { new: true, runValidators: true }),
  deleteById: (id) => User.findByIdAndDelete(id),
};
