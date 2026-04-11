import { Router } from "express";
import {
  createPet,
  getPets,
  updatePet,
  deletePet,
} from "../controllers/pets.controller.js";

const router = Router();

router.get("/", getPets);
router.post("/", createPet);
router.put("/:pid", updatePet);
router.delete("/:pid", deletePet);

export default router;
