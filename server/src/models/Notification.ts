import mongoose, { Document, Schema, Types } from "mongoose";

export interface INotification extends Document {
  user: Types.ObjectId;
  type: "booking" | "property_update" | "property_approved" | "property_rejected" | "favorite_update";
  title: string;
  message: string;
  relatedProperty?: Types.ObjectId;
  relatedBooking?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["booking", "property_update", "property_approved", "property_rejected", "favorite_update"],
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    relatedProperty: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      default: null
    },
    relatedBooking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
