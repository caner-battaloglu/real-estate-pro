import { User } from "../models/User";
import { Notification } from "../models/Notification";
import { Property } from "../models/Property";

export async function notifyFavoritePropertyUpdate(propertyId: string, changeType: string, changeDetails: string) {
  try {
    const property = await Property.findById(propertyId);
    if (!property) return;

    const usersWithFavorite = await User.find({ favorites: propertyId }).select("_id");

    if (usersWithFavorite.length === 0) return;

    const notifications = usersWithFavorite.map(user => ({
      user: user._id,
      type: "favorite_update" as const,
      title: "Favorite Property Updated",
      message: `${property.title} has been updated: ${changeDetails}`,
      relatedProperty: propertyId
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error("Error notifying favorite property update:", error);
  }
}

export async function notifyPriceChange(propertyId: string, oldPrice: number, newPrice: number) {
  const changeDetails = newPrice < oldPrice
    ? `Price reduced from $${oldPrice.toLocaleString()} to $${newPrice.toLocaleString()}`
    : `Price increased from $${oldPrice.toLocaleString()} to $${newPrice.toLocaleString()}`;

  await notifyFavoritePropertyUpdate(propertyId, "price_change", changeDetails);
}

export async function notifyPropertyStatusChange(propertyId: string, status: string) {
  const statusMessages: Record<string, string> = {
    approved: "Property is now available for viewing",
    rejected: "Property listing has been rejected",
    draft: "Property listing has been updated"
  };

  await notifyFavoritePropertyUpdate(propertyId, "status_change", statusMessages[status] || `Status changed to ${status}`);
}
