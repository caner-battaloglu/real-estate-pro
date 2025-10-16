import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { User } from "../models/User";
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

router.get("/me", authenticateToken, async (req, res) => {
  const dbUser = await User.findById(req.user!.id).select("email role");
  res.json({
    tokenUser: req.user,      // what the JWT says
    dbUser,                   // what Mongo says
  });
});

export default router;
