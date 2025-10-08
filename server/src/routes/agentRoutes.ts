import { Router } from "express";
import {
  createAgent,
  getAgentById,
  listAgents,
  updateAgent,
  deactivateAgent
} from "../controllers/agentController";

const router = Router();

router.get("/", listAgents);
router.get("/:id", getAgentById);
router.post("/", createAgent);
router.patch("/:id", updateAgent);
router.delete("/:id", deactivateAgent);

export default router;
