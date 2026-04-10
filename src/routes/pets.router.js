import { Router } from "express";
import {
  createPet,
  getPets,
  updatePet,
} from "../controllers/pets.controller.js";

const router = Router();

router.get("/", getPets);
router.post("/", createPet);
router.put("/:pid", updatePet);

export default router;
