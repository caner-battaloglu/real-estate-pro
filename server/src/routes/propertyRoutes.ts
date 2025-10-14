import { Router } from "express";
import { listPublic, getPropertyById } from "../controllers/propertyContoller";

const r = Router();

// Public catalogue
r.get("/properties", listPublic);
r.get("/properties/:id", getPropertyById);

export default r;
