import { Request, Response } from "express";
import { Property } from "../models/Property";
import { Agent } from "../models/Agent";
import { asyncHandler } from "../middleware/asyncHandler";

function hasAddressRequired(addr: any) {
  return !!(addr && addr.line1 && addr.city && addr.country);
}

// CREATE
export const createProperty = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body || {};
  if (!body.title) return res.status(400).json({ message: "title is required" });
  if (typeof body.price !== "number") return res.status(400).json({ message: "price (number) is required" });
  if (!hasAddressRequired(body.address)) {
    return res.status(400).json({ message: "address.line1, address.city, address.country are required" });
  }
  if (!body.agent) return res.status(400).json({ message: "agent is required" });

  const agentExists = await Agent.findById(body.agent);
  if (!agentExists) return res.status(400).json({ message: "Agent does not exist" });

  if (!body.location?.coordinates) {
    body.location = { type: "Point", coordinates: [0, 0] };
  }

  const created = await Property.create(body);
  res.status(201).json(created);
});

// READ (by id)
export const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
  const prop = await Property.findById(req.params.id)
    .where({ isDeleted: { $ne: true } })
    .populate("agent", "firstName lastName email");
  if (!prop) return res.status(404).json({ message: "Property not found" });
  res.json(prop);
});

// LIST (filters + paginate)
export const listProperties = asyncHandler(async (req: Request, res: Response) => {
  const { city, q, minPrice, maxPrice, listed, page = "1", limit = "10" } =
    req.query as Record<string, string>;

  const filter: any = { isDeleted: { $ne: true } };
  if (city) filter["address.city"] = { $regex: city, $options: "i" };
  if (q) filter.title = { $regex: q, $options: "i" };
  if (listed !== undefined) filter.listed = listed === "true";
  if (minPrice || maxPrice) {
    filter.price = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {})
    };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Property.find(filter)
      .populate("agent", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Property.countDocuments(filter)
  ]);

  res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

// UPDATE (partial)
export const updateProperty = asyncHandler(async (req: Request, res: Response) => {
  if (req.body?.agent) {
    const agentExists = await Agent.findById(req.body.agent);
    if (!agentExists) return res.status(400).json({ message: "Agent does not exist" });
  }
  if (req.body?.address && !hasAddressRequired(req.body.address)) {
    return res.status(400).json({
      message: "When updating address, include address.line1, address.city, address.country"
    });
  }

  const updated = await Property.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true, context: "query" }
  ).populate("agent", "firstName lastName email");

  if (!updated) return res.status(404).json({ message: "Property not found" });
  res.json(updated);
});

// DELETE (soft)
export const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
  const updated = await Property.findByIdAndUpdate(
    req.params.id,
    { $set: { isDeleted: true } },
    { new: true, runValidators: true, context: "query" }
  );
  if (!updated) return res.status(404).json({ message: "Property not found" });
  res.json({ message: "Property soft-deleted", property: updated });
});
