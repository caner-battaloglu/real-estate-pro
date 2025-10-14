import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth";
import { enforcePasswordChange } from "../middleware/enforcePasswordChange"; // ensure this file exists
import {
  createProperty,
  submitForApproval,
  listMine,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyContoller";

const r = Router();

// All agent endpoints require auth, agent/admin role, and first-login password change cleared
r.use(authenticateToken, requireRole("agent", "admin"), enforcePasswordChange);

// Agent dashboard: list mine
r.get("/properties", listMine);

// Create property
r.post("/properties", createProperty);

// Submit for approval (if you use a separate draft → submit flow)
r.post("/properties/:id/submit", submitForApproval);

// Update & delete (owner or admin)
r.patch("/properties/:id", updateProperty);
r.delete("/properties/:id", deleteProperty);

export default r;
