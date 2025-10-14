// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User"; // ← named import to match your model export
import { generateToken } from "../middleware/auth";

/** Normalize email consistently */
function normEmail(v: unknown) {
  return String(v || "").trim().toLowerCase();
}

/** SELF-REGISTER — forces role='public' regardless of input */
export async function register(req: Request, res: Response) {
  const email = normEmail(req.body.email);
  const { password, firstName, lastName } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "Email is already registered" });

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    role: "public",
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
}

/** LOGIN — selects password explicitly and compares; returns mustChangePassword if present on schema */
export async function login(req: Request, res: Response) {
  const email = normEmail(req.body.email);
  const password = String(req.body.password || "");

  // IMPORTANT: if password has select:false in schema, we must opt-in here
  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ error: "Invalid email or password" });
  if (user.isActive === false) return res.status(403).json({ error: "Account is inactive" });

  // Use schema method if present; otherwise fallback to bcrypt
  let ok = false;
  const anyUser = user as any;
  if (typeof anyUser.comparePassword === "function") {
    ok = await anyUser.comparePassword(password);
  } else {
    ok = await bcrypt.compare(password, String(anyUser.password || ""));
  }

  if (!ok) return res.status(401).json({ error: "Invalid email or password" });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      mustChangePassword: (user as any).mustChangePassword ?? false,
    },
  });
}

/** PROFILE — simple protected endpoint */
export async function getProfile(req: Request, res: Response) {
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
}


