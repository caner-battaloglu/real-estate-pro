import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth";
import {
  register,
  login,
  getProfile,
} from "../controllers/authController";

const router = Router();

/* Public */
router.post("/register", register);
router.post("/login", login);

/* Protected */
router.get("/profile", authenticateToken, getProfile);




export default router;
