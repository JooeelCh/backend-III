import { Router } from "express";
import {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
} from "../controllers/pets.controller.js";

const router = Router();

router.get("/", getPets);
router.get("/:pid", getPetById);
router.post("/", createPet);
router.put("/:pid", updatePet);
router.delete("/:pid", deletePet);

export default router;
