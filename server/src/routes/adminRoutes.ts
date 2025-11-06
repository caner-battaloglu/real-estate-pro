import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth";
import {
  createAgentByAdmin,
  listAllAgents,
  updateAgent,
  deleteAgent,
  approveProperty,
  rejectProperty,
  listPendingProperties,
  listAllProperties,
  updatePropertyByAdmin,
  deletePropertyByAdmin,
  getDashboardStats,
  getAgentPerformance
} from "../controllers/adminController";

const router = Router();

router.use(authenticateToken, requireRole("admin"));

router.post("/agents", createAgentByAdmin);
router.get("/agents", listAllAgents);
router.patch("/agents/:id", updateAgent);
router.delete("/agents/:id", deleteAgent);

router.get("/properties/pending", listPendingProperties);
router.get("/properties", listAllProperties);
router.patch("/properties/:id", updatePropertyByAdmin);
router.delete("/properties/:id", deletePropertyByAdmin);
router.post("/properties/:id/approve", approveProperty);
router.post("/properties/:id/reject", rejectProperty);

router.get("/dashboard/stats", getDashboardStats);
router.get("/agents/:id/performance", getAgentPerformance);

export default router;
