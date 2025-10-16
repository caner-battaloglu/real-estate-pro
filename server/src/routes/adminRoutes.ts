import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth"; // your existing middleware
import { createAgentByAdmin } from "../controllers/adminController";

const router = Router();

// All admin routes require admin
router.use(authenticateToken, requireRole("admin"));

// POST /api/admin/agents
router.post("/agents", createAgentByAdmin);

export default router;
