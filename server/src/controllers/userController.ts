import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { User } from "../models/User";
import { Property } from "../models/Property";
import { Notification } from "../models/Notification";

export const addToFavorites = asyncHandler(async (req: Request, res: Response) => {
  const { propertyId } = req.body;

  if (!propertyId) {
    return res.status(400).json({ message: "propertyId is required" });
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  const user = await User.findById(req.user!.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.favorites.includes(propertyId)) {
    return res.status(400).json({ message: "Property already in favorites" });
  }

  user.favorites.push(propertyId);
  await user.save();

  res.json({ message: "Property added to favorites", favorites: user.favorites });
});

export const removeFromFavorites = asyncHandler(async (req: Request, res: Response) => {
  const { propertyId } = req.params;

  const user = await User.findById(req.user!.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.favorites = user.favorites.filter(fav => String(fav) !== propertyId);
  await user.save();

  res.json({ message: "Property removed from favorites", favorites: user.favorites });
});

export const getFavorites = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id).populate("favorites");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ favorites: user.favorites });
});

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { unreadOnly } = req.query;
  const filter: any = { user: req.user!.id };

  if (unreadOnly === "true") {
    filter.read = false;
  }

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("relatedProperty", "title images")
    .lean();

  const unreadCount = await Notification.countDocuments({ user: req.user!.id, read: false });

  res.json({ notifications, unreadCount });
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const notification = await Notification.findOne({ _id: id, user: req.user!.id });
  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  notification.read = true;
  await notification.save();

  res.json({ message: "Notification marked as read" });
});

export const markAllNotificationsRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.updateMany(
    { user: req.user!.id, read: false },
    { $set: { read: true } }
  );

  res.json({ message: "All notifications marked as read" });
});
