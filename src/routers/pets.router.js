import { Router } from "express";
import mongoose from "mongoose";
import Pet from "../models/Pet.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find();

    res.json({
      status: "success",
      payload: pets,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  const { name, species, age } = req.body;

  if (!name || !species || age === undefined) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Nombre, especie y edad son obligatorios",
      });
  }

  try {
    const pet = await Pet.create({ name, species, age });

    return res.status(201).json({ status: "success", payload: pet });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res
      .status(400)
      .json({ status: "error", message: "El ID de la mascota no es valido" });
  }

  try {
    const pet = await Pet.findByIdAndUpdate(pid, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pet) {
      return res
        .status(404)
        .json({ status: "error", message: "Mascota no encontrada" });
    }

    return res.json({ status: "success", payload: pet });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
