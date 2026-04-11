import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  currentSession,
  loginSession,
  logoutSession,
  registerSession,
} from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", registerSession);
router.post("/login", loginSession);
router.get("/current", authMiddleware, currentSession);
router.post("/logout", authMiddleware, logoutSession);

export default router;
