import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.json({
      status: "success",
      payload: users,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(uid)) {
    return res
      .status(400)
      .json({ status: "error", message: "El id del usuario no es válido" });
  }

  try {
    const user = await User.findById(uid);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    }

    return res.json({ status: "success", payload: user });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Nombre, apellido, correo y constraseña son obligatorios",
    });
  }

  try {
    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
      role,
    });

    return res.status(201).json({ status: "success", payload: user });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(uid)) {
    return res
      .status(400)
      .json({ status: "error", message: "El id del usuario no es válido" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(uid, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    }

    return res.json({ status: "success", payload: updatedUser });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(uid)) {
    return res
      .status(400)
      .json({ status: "error", message: "El id del usuario no es válido" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(uid);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    }

    return res.json({
      status: "success",
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});
export default router;
