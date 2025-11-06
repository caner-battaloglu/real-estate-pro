import { Request, Response } from "express";
import crypto from "crypto";
import { User } from "../models/User";
import { Property } from "../models/Property";
import { Agent } from "../models/Agent";
import { Booking } from "../models/Booking";
import { Notification } from "../models/Notification";
import { asyncHandler } from "../middleware/asyncHandler";

// Normalize email
function normEmail(v: unknown) {
  return String(v || "").trim().toLowerCase();
}

// Dev-friendly random temp password (hex)
function generateTempPassword(length = 12) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
}

/**
 * POST /api/admin/agents
 * Admin-only: create Agent with temp password.
 * - role: "agent"
 * - createdByAdmin: true
 * - mustChangePassword: true
 * Returns tempPassword (dev-only convenience)
 */
export const createAgentByAdmin = async (req: Request, res: Response) => {
  try {
    const email = normEmail(req.body?.email);
    const firstName = String(req.body?.firstName || "").trim();
    const lastName = String(req.body?.lastName || "").trim();

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ message: "email, firstName, lastName are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const tempPassword = generateTempPassword(12);

    // IMPORTANT: save plain temp password; model pre-save hook will hash once.
    const created = await User.create({
      email,
      firstName,
      lastName,
      password: tempPassword,
      role: "agent",
      createdByAdmin: true,
      mustChangePassword: true,
      isActive: true,
    });

    return res.status(201).json({
      message: "Agent created",
      agent: {
        id: created.id,
        email: created.email,
        firstName: created.firstName,
        lastName: created.lastName,
        role: created.role,
        mustChangePassword: true,
        createdByAdmin: true,
        isActive: true,
      },
      tempPassword, // dev-only; remove in prod
    });
  } catch (err) {
    console.error("createAgentByAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const listAllAgents = asyncHandler(async (req: Request, res: Response) => {
  const agents = await User.find({ role: "agent" }).select("-password");
  res.json({ agents });
});

export const updateAgent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, isActive } = req.body;

  const agent = await User.findOne({ _id: id, role: "agent" });
  if (!agent) {
    return res.status(404).json({ message: "Agent not found" });
  }

  if (firstName) agent.firstName = firstName;
  if (lastName) agent.lastName = lastName;
  if (email) agent.email = email;
  if (typeof isActive === "boolean") agent.isActive = isActive;

  await agent.save();
  res.json({ agent: { id: agent.id, firstName: agent.firstName, lastName: agent.lastName, email: agent.email, isActive: agent.isActive } });
});

export const deleteAgent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const agent = await User.findOne({ _id: id, role: "agent" });

  if (!agent) {
    return res.status(404).json({ message: "Agent not found" });
  }

  await Property.updateMany({ agent: id }, { $set: { status: "draft" } });
  await agent.deleteOne();

  res.json({ message: "Agent deleted" });
});

export const approveProperty = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const property = await Property.findById(id);

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  property.status = "approved";
  property.approvedBy = req.user!.id as any;
  property.approvedAt = new Date();
  property.rejectionReason = null;
  await property.save();

  await Notification.create({
    user: property.agent,
    type: "property_approved",
    title: "Property Approved",
    message: `Your property "${property.title}" has been approved and is now live!`,
    relatedProperty: property.id
  });

  res.json({ message: "Property approved", property });
});

export const rejectProperty = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ message: "Rejection reason is required" });
  }

  const property = await Property.findById(id);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  property.status = "rejected";
  property.rejectionReason = reason;
  property.approvedBy = req.user!.id as any;
  property.approvedAt = new Date();
  await property.save();

  await Notification.create({
    user: property.agent,
    type: "property_rejected",
    title: "Property Rejected",
    message: `Your property "${property.title}" has been rejected. Reason: ${reason}`,
    relatedProperty: property.id
  });

  res.json({ message: "Property rejected", property });
});

export const listPendingProperties = asyncHandler(async (req: Request, res: Response) => {
  const properties = await Property.find({ status: "pending" })
    .populate("agent", "firstName lastName email")
    .sort({ createdAt: -1 });
  res.json({ properties });
});

export const listAllProperties = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const filter: any = {};
  if (status) filter.status = status;

  const properties = await Property.find(filter)
    .populate("agent", "firstName lastName email")
    .sort({ createdAt: -1 });
  res.json({ properties });
});

export const updatePropertyByAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const property = await Property.findById(id);

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  const allowedFields = ["title", "description", "price", "type", "bedrooms", "bathrooms", "area", "images", "address", "location", "status"];

  allowedFields.forEach(field => {
    if (field in req.body) {
      (property as any)[field] = req.body[field];
    }
  });

  await property.save();
  res.json({ property });
});

export const deletePropertyByAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const property = await Property.findById(id);

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  await Booking.deleteMany({ property: id });
  await property.deleteOne();

  res.json({ message: "Property deleted" });
});

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const totalProperties = await Property.countDocuments();
  const approvedProperties = await Property.countDocuments({ status: "approved" });
  const pendingProperties = await Property.countDocuments({ status: "pending" });
  const rejectedProperties = await Property.countDocuments({ status: "rejected" });
  const totalAgents = await User.countDocuments({ role: "agent" });
  const activeAgents = await User.countDocuments({ role: "agent", isActive: true });
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: "pending" });
  const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });

  const propertiesByType = await Property.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: "$type", count: { $sum: 1 } } }
  ]);

  const propertiesByStatus = await Property.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const revenueData = await Property.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: null, totalRevenue: { $sum: "$price" }, avgPrice: { $avg: "$price" } } }
  ]);

  const topAgents = await Property.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: "$agent", propertyCount: { $sum: 1 }, totalValue: { $sum: "$price" } } },
    { $sort: { propertyCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "agentInfo"
      }
    },
    { $unwind: "$agentInfo" },
    {
      $project: {
        agentId: "$_id",
        propertyCount: 1,
        totalValue: 1,
        agentName: { $concat: ["$agentInfo.firstName", " ", "$agentInfo.lastName"] },
        email: "$agentInfo.email"
      }
    }
  ]);

  const recentActivity = await Property.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("agent", "firstName lastName")
    .select("title status createdAt agent");

  res.json({
    stats: {
      properties: { total: totalProperties, approved: approvedProperties, pending: pendingProperties, rejected: rejectedProperties },
      agents: { total: totalAgents, active: activeAgents },
      users: totalUsers,
      bookings: { total: totalBookings, pending: pendingBookings, confirmed: confirmedBookings }
    },
    propertiesByType,
    propertiesByStatus,
    revenue: revenueData[0] || { totalRevenue: 0, avgPrice: 0 },
    topAgents,
    recentActivity
  });
});

export const getAgentPerformance = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const agent = await User.findOne({ _id: id, role: "agent" }).select("-password");
  if (!agent) {
    return res.status(404).json({ message: "Agent not found" });
  }

  const totalProperties = await Property.countDocuments({ agent: id });
  const approvedProperties = await Property.countDocuments({ agent: id, status: "approved" });
  const pendingProperties = await Property.countDocuments({ agent: id, status: "pending" });
  const rejectedProperties = await Property.countDocuments({ agent: id, status: "rejected" });

  const totalBookings = await Booking.countDocuments({ agent: id });
  const completedBookings = await Booking.countDocuments({ agent: id, status: "completed" });

  const propertyValues = await Property.aggregate([
    { $match: { agent: agent._id, status: "approved" } },
    { $group: { _id: null, totalValue: { $sum: "$price" }, avgValue: { $avg: "$price" } } }
  ]);

  const properties = await Property.find({ agent: id })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("title status price createdAt");

  res.json({
    agent: { id: agent.id, firstName: agent.firstName, lastName: agent.lastName, email: agent.email, isActive: agent.isActive },
    performance: {
      properties: { total: totalProperties, approved: approvedProperties, pending: pendingProperties, rejected: rejectedProperties },
      bookings: { total: totalBookings, completed: completedBookings },
      values: propertyValues[0] || { totalValue: 0, avgValue: 0 }
    },
    recentProperties: properties
  });
});
