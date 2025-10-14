import { Request, Response } from "express";
import {asyncHandler} from "../middleware/asyncHandler";
import { Property } from "../models/Property";

/**
 * Create a property (agent/admin)
 * - agent is taken from req.user.id (never from client body)
 * - status defaults to "pending" for moderation
 * - address.line1, address.city, address.country are required
 */
export const createProperty = asyncHandler(async (req: Request, res: Response) => {
  const address = req.body?.address;
  if (!address || !address.line1 || !address.city || !address.country) {
    return res
      .status(400)
      .json({ message: "address.line1, address.city, address.country are required" });
  }

  const payload = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    type: req.body.type,
    bedrooms: req.body.bedrooms,
    bathrooms: req.body.bathrooms,
    area: req.body.area,
    images: req.body.images,
    address,
    agent: req.user!.id, // <- critical: set server-side
    status: "pending",   // moderation workflow default
  };

  const doc = await Property.create(payload);
  return res.status(201).json({ property: doc });
});

/**
 * Submit a property for approval (agent/admin)
 * - only the owning agent can submit
 * - sets status back to "pending" and clears approval fields
 */
export const submitForApproval = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const prop = await Property.findOne({ _id: id, agent: req.user!.id });
  if (!prop) return res.status(404).json({ message: "Property not found" });

  if (prop.status === "approved") {
    return res.status(400).json({ message: "Property already approved" });
  }

  prop.status = "pending";
  prop.approvedBy = null;
  prop.approvedAt = null;
  prop.rejectionReason = null;
  await prop.save();

  return res.json({ message: "Submitted for approval", property: { id: prop.id, status: prop.status } });
});

/**
 * Public list — only approved properties
 */
export const listPublic = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Property.find({ status: "approved" }).lean();
  return res.json({ items });
});

/**
 * Agent dashboard list — properties owned by current agent (any status)
 */
export const listMine = asyncHandler(async (req: Request, res: Response) => {
  const items = await Property.find({ agent: req.user!.id }).lean();
  return res.json({ items });
});

/**
 * Public detail — only if approved (or allow agent/admin to see their own)
 */
export const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const prop = await Property.findById(id).lean();
  if (!prop) return res.status(404).json({ message: "Property not found" });

  // If not approved, hide from public; allow owner/admin visibility if your auth puts req.user
  if (prop.status !== "approved") {
    const isOwner = req.user && String(prop.agent) === req.user.id;
    const isAdmin = req.user && req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(404).json({ message: "Property not found" });
    }
  }

  return res.json({ property: prop });
});

/**
 * Update property (agent/admin)
 * - only owner agent or admin can update
 * - keep moderation simple: editing re-submits to pending (optional rule)
 */
export const updateProperty = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const prop = await Property.findById(id);
  if (!prop) return res.status(404).json({ message: "Property not found" });

  const isOwner = prop.agent && String(prop.agent) === req.user!.id;
  const isAdmin = req.user!.role === "admin";
  if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

  // Apply allowed updates
  const updatable = [
    "title",
    "description",
    "price",
    "type",
    "bedrooms",
    "bathrooms",
    "area",
    "images",
    "address",
  ] as const;

  for (const key of updatable) {
    if (key in req.body) {
      // @ts-expect-error index access is safe for controlled keys
      prop[key] = req.body[key];
    }
  }

  // Optional rule: any edit reverts to pending for re-approval
  if (!isAdmin) {
    prop.status = "pending";
    prop.approvedBy = null;
    prop.approvedAt = null;
    prop.rejectionReason = null;
  }

  await prop.save();
  return res.json({ property: prop });
});

/**
 * Delete property (agent owner or admin)
 */
export const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const prop = await Property.findById(id);
  if (!prop) return res.status(404).json({ message: "Property not found" });

  const isOwner = prop.agent && String(prop.agent) === req.user!.id;
  const isAdmin = req.user!.role === "admin";
  if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

  await prop.deleteOne();
  return res.json({ message: "Property deleted" });
});
