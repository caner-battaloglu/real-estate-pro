import { Router } from "express";
import {
  createProperty,
  getPropertyById,
  listProperties,
  updateProperty,
  deleteProperty
} from "../controllers/propertyContoller"; // keep your original filename

const router = Router();

router.get("/", listProperties);
router.get("/:id", getPropertyById);
router.post("/", createProperty);
router.patch("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;
