import { Router } from "express";
import {
  currentSession,
  loginSession,
  logoutSession,
  registerSession,
} from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", registerSession);
router.post("/login", loginSession);
router.get("/current", currentSession);
router.post("/logout", logoutSession);

export default router;
