import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err?.stack || err);
  if (err?.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  if (err?.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  res.status(err?.status || 500).json({ message: err?.message || "Server error" });
};
