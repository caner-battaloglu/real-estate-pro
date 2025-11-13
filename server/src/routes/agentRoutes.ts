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
import { listAgents, getAgentById } from "../controllers/agentController";

const router = Router();

// Health check to prove this router is mounted:
router.get("/health", (_req, res) => res.json({ ok: true, scope: "agent" }));

// Public catalogue of agents
router.get("/", listAgents);

// Agent-managed property endpoints (protected)
const propertiesRouter = Router();

propertiesRouter.get("/", listMine);
propertiesRouter.post("/", createProperty);
propertiesRouter.post("/:id/submit", submitForApproval);
propertiesRouter.patch("/:id", updateProperty);
propertiesRouter.delete("/:id", deleteProperty);

router.use(
  "/properties",
  authenticateToken,
  requireRole("agent", "admin"),
  enforcePasswordChange,
  propertiesRouter
);

// Public agent detail (registered after property routes to avoid shadowing)
router.get("/:id", getAgentById);

export default router;
