import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export type AppRole = "user" | "agent" | "admin";

export type JwtUser = { id: string; email: string; role: AppRole; jti: string };

declare global {
  // Make TS aware of req.user after authentication
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

// ---------- config helpers ----------
function env(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing env: ${name}`);
  return v;
}
function getAccessSecret() {
  return env("ACCESS_TOKEN_SECRET");
}
function accessTTLMinutes() {
  return Number(process.env.ACCESS_TOKEN_MIN ?? 15);
}
function refreshDaysDefault() {
  return Number(process.env.REFRESH_TOKEN_DAYS ?? 7);
}
function refreshDaysRemember() {
  return Number(process.env.REFRESH_TOKEN_REMEMBER_DAYS ?? 30);
}

// ---------- token helpers ----------
export function signAccess(user: { id: string; email: string; role: AppRole }) {
  const jti = crypto.randomUUID();
  const payload: JwtUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    jti,
  };
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: `${accessTTLMinutes()}m`,
  });
}
export function makeRefresh() {
  const raw = crypto.randomBytes(48).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export function hashToken(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export const refreshCookieName = "refreshToken";

export function setRefreshCookie(
  res: Response,
  token: string,
  expiresAt: Date
) {
  res.cookie(refreshCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: expiresAt,
    path: "/api/auth/refresh",
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(refreshCookieName, { path: "/api/auth/refresh" });
}

// ---------- middlewares ----------
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const hdr = req.headers.authorization;
  const token = hdr?.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing access token" });

  try {
    const payload = jwt.verify(token, getAccessSecret()) as JwtUser;
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(...roles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ error: "Authentication required" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient privileges" });
    }
    next();
  };
}
