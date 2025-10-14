import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

export async function enforcePasswordChange(req: Request, res: Response, next: NextFunction) {
  const uid = req.user?.id;
  if (!uid) return res.status(401).json({ error: "Unauthenticated" });

  const user = await User.findById(uid).select("role mustChangePassword");
  if (!user) return res.status(401).json({ error: "Unauthenticated" });

  if (user.role === "agent" && user.mustChangePassword) {
    return res.status(423).json({
      error: "Password change required",
      code: "PASSWORD_CHANGE_REQUIRED",
    });
  }
  next();
}
