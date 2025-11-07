import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { Booking } from "../models/Booking";
import { Property } from "../models/Property";
import { Notification } from "../models/Notification";

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const { propertyId, visitDate, visitTime, message } = req.body;

  if (!propertyId || !visitDate || !visitTime) {
    return res.status(400).json({ message: "propertyId, visitDate, and visitTime are required" });
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  if (property.status !== "approved") {
    return res.status(400).json({ message: "Property is not available for booking" });
  }

  const booking = await Booking.create({
    property: propertyId,
    user: req.user!.id,
    agent: property.agent,
    visitDate: new Date(visitDate),
    visitTime,
    message,
    status: "pending"
  });

  await Notification.create({
    user: property.agent,
    type: "booking",
    title: "New Booking Request",
    message: `New visit request for ${property.title} on ${visitDate} at ${visitTime}`,
    relatedProperty: propertyId,
    relatedBooking: booking.id
  });

  await booking.populate([
    { path: "property", select: "title images address" },
    { path: "agent", select: "firstName lastName email" }
  ]);

  res.status(201).json({ booking });
});

export const getUserBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await Booking.find({ user: req.user!.id })
    .populate("property", "title images address price")
    .populate("agent", "firstName lastName email")
    .sort({ createdAt: -1 });

  res.json({ bookings });
});

export const getAgentBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await Booking.find({ agent: req.user!.id })
    .populate("property", "title images address")
    .populate("user", "firstName lastName email")
    .sort({ visitDate: 1 });

  res.json({ bookings });
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const isAgent = String(booking.agent) === req.user!.id;
  const isUser = String(booking.user) === req.user!.id;
  const isAdmin = req.user!.role === "admin";

  if (!isAgent && !isUser && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  booking.status = status;
  if (notes) booking.notes = notes;
  await booking.save();

  const notificationUser = isAgent ? booking.user : booking.agent;
  const property = await Property.findById(booking.property);

  await Notification.create({
    user: notificationUser,
    type: "booking",
    title: "Booking Status Updated",
    message: `Your booking for ${property?.title} has been ${status}`,
    relatedProperty: booking.property,
    relatedBooking: booking.id
  });

  await booking.populate([
    { path: "property", select: "title images address" },
    { path: "user", select: "firstName lastName email" },
    { path: "agent", select: "firstName lastName email" }
  ]);

  res.json({ booking });
});

export const deleteBooking = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const isUser = String(booking.user) === req.user!.id;
  const isAdmin = req.user!.role === "admin";

  if (!isUser && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await booking.deleteOne();
  res.json({ message: "Booking deleted" });
});
