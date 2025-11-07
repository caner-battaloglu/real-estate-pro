import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from "../controllers/userController";

const router = Router();

router.use(authenticateToken);

router.post("/favorites", addToFavorites);
router.delete("/favorites/:propertyId", removeFromFavorites);
router.get("/favorites", getFavorites);

router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markNotificationRead);
router.post("/notifications/read-all", markAllNotificationsRead);

export default router;
