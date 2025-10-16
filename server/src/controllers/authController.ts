// src/controllers/authController.ts
import { Request, Response } from "express";
import { User } from "../models/User";
import {
  signAccess,
  makeRefresh,
  setRefreshCookie,
  clearRefreshCookie,
  hashToken,
} from "../middleware/auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/** Normalize email consistently */
function normEmail(v: unknown) {
  return String(v || "")
    .trim()
    .toLowerCase();
}

/** SELF-REGISTER — forces role='public' regardless of input */
export async function register(req: Request, res: Response) {
  try {
    const email = normEmail(req.body.email);
    const { password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ error: "Email already registered" });

    const user = await User.create({
      email,
      password,
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      role: "user",
    });

    // Dev-mode email verification token (optional)
    const verifyRaw = crypto.randomBytes(24).toString("hex");
    user.emailVerifyTokenHash = hashToken(verifyRaw);
    user.emailVerifyExpiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h
    await user.save();

    // In dev, return the token so you can hit /verify
    const devToken =
      process.env.NODE_ENV !== "production" ? verifyRaw : undefined;

    return res.status(201).json({
      message: "Registered",
      verifyToken: devToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed" });
  }
}

/** LOGIN — sets refresh cookie + returns access token */
export async function login(req: Request, res: Response) {
  try {
    const email = normEmail(req.body.email);
    const { password, remember } = req.body;

    const user = await User.findOne({ email }).select(
      "+password +refreshTokenHash"
    );
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const access = signAccess({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // create & store refresh (hash only)
    const { raw, hash } = makeRefresh();
    const days = remember
      ? Number(process.env.REFRESH_TOKEN_REMEMBER_DAYS ?? 30)
      : Number(process.env.REFRESH_TOKEN_DAYS ?? 7);
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    user.refreshTokenHash = hash;
    user.refreshTokenExpiresAt = expiresAt;
    await user.save();

    setRefreshCookie(res, raw, expiresAt);

    return res.json({
      token: access,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        mustChangePassword: user.mustChangePassword, // <= add this
      },
    });
  } catch {
    return res.status(500).json({ error: "Login failed" });
  }
}

/** REFRESH — rotates refresh token and returns a new access token */
export async function refresh(req: Request, res: Response) {
  try {
    const raw = req.cookies?.refreshToken as string | undefined;
    if (!raw) return res.status(401).json({ error: "Missing refresh token" });

    const h = hashToken(raw);
    const user = await User.findOne({ refreshTokenHash: h });
    if (
      !user ||
      !user.refreshTokenExpiresAt ||
      user.refreshTokenExpiresAt < new Date()
    ) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    // rotate
    const access = signAccess({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const { raw: nextRaw, hash: nextHash } = makeRefresh();

    // keep same longevity window as before (simple approach)
    const now = Date.now();
    const msLeft = Math.max(0, user.refreshTokenExpiresAt.getTime() - now);
    const expiresAt = new Date(
      now + (msLeft || Number(process.env.REFRESH_TOKEN_DAYS ?? 7) * 86400000)
    );

    user.refreshTokenHash = nextHash;
    user.refreshTokenExpiresAt = expiresAt;
    await user.save();

    setRefreshCookie(res, nextRaw, expiresAt);
    return res.json({ token: access });
  } catch {
    return res.status(500).json({ error: "Refresh failed" });
  }
}

/** LOGOUT — clears server-side refresh + cookie */
export async function logout(req: Request, res: Response) {
  try {
    const raw = req.cookies?.refreshToken as string | undefined;
    if (raw) {
      const h = hashToken(raw);
      await User.updateMany(
        { refreshTokenHash: h },
        { $set: { refreshTokenHash: null, refreshTokenExpiresAt: null } }
      );
    }
    clearRefreshCookie(res);
    return res.json({ message: "Logged out" });
  } catch {
    return res.status(500).json({ error: "Logout failed" });
  }
}

/** WHOAMI */
export async function getProfile(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
  const user = await User.findById(req.user.id);
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

/** Request password reset — dev returns token */
export async function forgotPassword(req: Request, res: Response) {
  const email = normEmail(req.body.email);
  const user = await User.findOne({ email }).select("+passwordResetTokenHash");
  // Always OK (avoid enumeration)
  if (!user)
    return res.json({
      message: "If that email exists, a reset link has been sent.",
    });

  const raw = crypto.randomBytes(32).toString("hex");
  const hash = hashToken(raw);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30m

  user.passwordResetTokenHash = hash;
  user.passwordResetExpiresAt = expiresAt;
  await user.save();

  if (process.env.NODE_ENV !== "production") {
    return res.json({ resetToken: raw, expiresAt });
  }
  return res.json({
    message: "If that email exists, a reset link has been sent.",
  });
}

/** Confirm password reset */
export async function resetPassword(req: Request, res: Response) {
  const { token, newPassword } = req.body as {
    token?: string;
    newPassword?: string;
  };
  if (!token || !newPassword)
    return res
      .status(400)
      .json({ error: "token and newPassword are required" });

  const hash = hashToken(token);
  const user = await User.findOne({
    passwordResetTokenHash: hash,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select("+password");

  if (!user)
    return res.status(400).json({ error: "Invalid or expired reset token" });

  user.password = newPassword; // pre-save hook will hash
  user.passwordResetTokenHash = null;
  user.passwordResetExpiresAt = null;

user.password = newPassword;                // pre-save hook hashes
user.mustChangePassword = false;            // <= clear the first-login lock
user.refreshTokenHash = null;               // optional but recommended: revoke sessions
user.refreshTokenExpiresAt = null;
await user.save();

return res.json({ message: "Password updated" });
}

/** Verify email — dev flow */
export async function verifyEmail(req: Request, res: Response) {
  const { token } = req.body as { token?: string };
  if (!token) return res.status(400).json({ error: "token is required" });

  const hash = hashToken(token);
  const user = await User.findOne({
    emailVerifyTokenHash: hash,
    emailVerifyExpiresAt: { $gt: new Date() },
  });

  if (!user)
    return res
      .status(400)
      .json({ error: "Invalid or expired verification token" });

  user.emailVerifiedAt = new Date();
  user.emailVerifyTokenHash = null;
  user.emailVerifyExpiresAt = null;
  await user.save();

  return res.json({ message: "Email verified" });
}
