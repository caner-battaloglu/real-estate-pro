import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth";
import {
  createBooking,
  getUserBookings,
  getAgentBookings,
  updateBookingStatus,
  deleteBooking
} from "../controllers/bookingController";

const router = Router();

router.use(authenticateToken);

router.post("/", requireRole("user"), createBooking);
router.get("/my-bookings", requireRole("user"), getUserBookings);
router.get("/agent-bookings", requireRole("agent", "admin"), getAgentBookings);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;
