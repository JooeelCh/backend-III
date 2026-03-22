import { Router } from "express";
import mongoose, { Promise } from "mongoose";
import Adoption from "../models/Adoption.js";
import User from "../models/User";
import Pet from "../models/Pet";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const adoptions = await Adoption.find().populate("owner pet");
    return res.json({ status: "success", payload: adoptions });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.messag });
  }
});

router.get("/:aid", async (req, res) => {
  const { aid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(aid)) {
    return res
      .status(400)
      .json({ status: "error", message: "El ID de la adopcion no es valido" });
  }

  try {
    const adoption = await Adoption.findById(aid).populate("owner pet");

    if (!adoption) {
      return res
        .status(404)
        .json({ status: "error", message: "Adopcion no encontrada" });
    }

    return res.json({ status: "success", payload: adoption });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/:uid/:pid", async (req, res) => {
  const { uid, pid } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(uid) ||
    !mongoose.Types.ObjectId.isValid(pid)
  ) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "El ID del usuario y la mascota deben ser validos",
      });
  }

  try {
    const [user, pet] = await Promise.all([
      User.findById(uid),
      Pet.findById(pid),
    ]);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    }

    if (!pet) {
      return res
        .status(404)
        .json({ status: "error", message: "Mascota no encontrada" });
    }

    if (pet.adopted) {
      return res
        .status(409)
        .json({
          status: "error",
          message: "La mascota ya se encuenta adoptada",
        });
    }

    pet.adopted = true;
    pet.owner = user._id;
    user.pets = [...(user.pets ?? []), pet._id];

    const adoption = await Adoption.create({ owner: user._id, pet: pet._id });

    await Promise.all([pet.save(), user.save()]);

    return res
      .status(201)
      .json({
        status: "success",
        message: "Adopcion exitosa",
        payload: adoption,
      });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});
