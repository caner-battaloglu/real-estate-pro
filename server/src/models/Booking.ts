import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBooking extends Document {
  property: Types.ObjectId;
  user: Types.ObjectId;
  agent: Types.ObjectId;
  visitDate: Date;
  visitTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  message?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    visitDate: {
      type: Date,
      required: true,
      index: true
    },
    visitTime: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true
    },
    message: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
  },
  { timestamps: true }
);

BookingSchema.index({ agent: 1, visitDate: 1 });
BookingSchema.index({ user: 1, createdAt: -1 });

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
