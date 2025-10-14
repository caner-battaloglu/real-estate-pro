import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  register,
  login,
  refresh,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/authController";

const router = Router();

/* Public */
router.post("/register", register);
router.post("/login", login);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);
router.post("/verify", verifyEmail);

/* Refresh + Logout */
router.post("/refresh", refresh);
router.post("/logout", logout);

/* Protected */
router.get("/profile", authenticateToken, getProfile);

export default router;
