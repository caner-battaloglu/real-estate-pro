import { Request, Response } from "express";
import { Agent } from "../models/Agent";
import { asyncHandler } from "../middleware/asyncHandler";

// CREATE
export const createAgent = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body || {};
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: "firstName, lastName, email are required" });
  }
  const created = await Agent.create(req.body);
  res.status(201).json(created);
});

// READ (by id)
export const getAgentById = asyncHandler(async (req: Request, res: Response) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) return res.status(404).json({ message: "Agent not found" });
  res.json(agent);
});

// LIST (search + paginate)
export const listAgents = asyncHandler(async (req: Request, res: Response) => {
  const { q, active, page = "1", limit = "10" } = req.query as Record<string, string>;
  const filter: any = {};
  if (typeof active === "string") filter.isActive = active === "true";
  if (q && q.trim()) {
    filter.$or = [
      { firstName: { $regex: q, $options: "i" } },
      { lastName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { agency: { $regex: q, $options: "i" } }
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Agent.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Agent.countDocuments(filter)
  ]);

  res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

// UPDATE (partial)
export const updateAgent = asyncHandler(async (req: Request, res: Response) => {
  const updated = await Agent.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true, context: "query" }
  );
  if (!updated) return res.status(404).json({ message: "Agent not found" });
  res.json(updated);
});

// DELETE (soft: deactivate)
export const deactivateAgent = asyncHandler(async (req: Request, res: Response) => {
  const updated = await Agent.findByIdAndUpdate(
    req.params.id,
    { $set: { isActive: false } },
    { new: true, runValidators: true, context: "query" }
  );
  if (!updated) return res.status(404).json({ message: "Agent not found" });
  res.json({ message: "Agent deactivated", agent: updated });
});
