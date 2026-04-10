import { Router } from "express";
import {
  createAdoption,
  getAdoptionById,
  getAdoptions,
} from "../controllers/adoptions.controller.js";

const router = Router();

router.get("/", getAdoptions);
router.get("/:aid", getAdoptionById);
router.post("/:uid/:pid", createAdoption);

export default router;
