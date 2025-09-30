import {Router } from 'express';
import { createAgent, getAgentById } from '../controllers/agentController';

const router = Router ();

router.post('/', createAgent);
router.get('/:id',getAgentById);

export default router;