import { Router } from "express";
import { listPublic, getPropertyById } from "../controllers/propertyContoller";

const r = Router();

// Public catalogue
r.get("/", listPublic);
r.get("/:id", getPropertyById);

export default r;
