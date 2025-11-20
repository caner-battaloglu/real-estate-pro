import { Request, Response } from "express";
import { Agent } from "../models/Agent";
import { User } from "../models/User";
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
  const agent = await User.findOne({ _id: req.params.id, role: "agent" });
  if (!agent) return res.status(404).json({ message: "Agent not found" });
  res.json(agent);
});

// LIST (search + paginate) - Query User collection for agents
export const listAgents = asyncHandler(async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("listAgents called public endpoint");
  }
  const { q, active, page = "1", limit = "100", country } = req.query as Record<string, string>;
  const filter: any = { role: "agent" };
  
  if (typeof active === "string") {
    filter.isActive = active === "true";
  } else {
    // Default to only active agents if not specified
    filter.isActive = true;
  }

  if (country && country !== "all") {
    filter.marketCountry = country;
  }
  
  if (q && q.trim()) {
    filter.$or = [
      { firstName: { $regex: q, $options: "i" } },
      { lastName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } }
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 100);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshTokenHash -passwordResetTokenHash -emailVerifyTokenHash")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter)
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
