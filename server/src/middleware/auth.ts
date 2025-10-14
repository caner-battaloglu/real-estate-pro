import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/** Centralized app roles */
export type AppRole = "public" | "agent" | "admin";

/** What goes into JWT and onto req.user */
export type JwtUser = { id: string; email: string; role: AppRole };

/** Augment Express.Request so TS knows req.user exists after auth */
declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

function getJwtSecret(): string {
  const value = process.env.JWT_SECRET;
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn("WARNING: JWT_SECRET is not set. Define it in server/.env");
    throw new Error("JWT_SECRET is not configured");
  }
  return value;
}

/** Bearer token auth — attaches {id,email,role} to req.user on success */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access token required" });
  }

  const token = authHeader.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtUser & { iat: number; exp: number };
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/** Role gate: require at least one of the provided roles */
export function requireRole(...roles: AppRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Authentication required" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient privileges" });
    }
    next();
  };
}

/** Helper to sign tokens consistently */
export function generateToken(payload: JwtUser) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}
