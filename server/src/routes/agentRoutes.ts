import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth";
import { enforcePasswordChange } from "../middleware/enforcePasswordChange";
import {
  createProperty,
  submitForApproval,
  listMine,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyContoller"; // NOTE: your file name has 'Contoller'

const router = Router();

// Health check to prove this router is mounted:
router.get("/health", (_req, res) => res.json({ ok: true, scope: "agent" }));

// All agent endpoints require auth + role + first-login cleared
router.use(authenticateToken, requireRole("agent", "admin"), enforcePasswordChange);

router.get("/properties", listMine);
router.post("/properties", createProperty);
router.post("/properties/:id/submit", submitForApproval);
router.patch("/properties/:id", updateProperty);
router.delete("/properties/:id", deleteProperty);

export default router;
