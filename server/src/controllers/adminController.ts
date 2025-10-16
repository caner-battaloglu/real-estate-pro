import { Request, Response } from "express";
import crypto from "crypto";
import { User } from "../models/User"; // adjust if your model exports differently

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
