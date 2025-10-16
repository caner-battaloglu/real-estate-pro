// src/models/Property.ts
import mongoose, { Document, Schema, Types } from "mongoose";

type GeoPoint = {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
};

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };

  // human-readable location label (e.g., "Istanbul, TR")
  location?: string;

  // geospatial point for map queries
  geo?: GeoPoint | null;

  // workflow
  status: "draft" | "pending" | "approved" | "rejected";
  agent: Types.ObjectId;
  approvedBy?: Types.ObjectId | null;
  approvedAt?: Date | null;
  rejectionReason?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

const GeoSchema = new Schema<GeoPoint>(
  {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: {
      type: [Number],
      required: true,
      // [lng, lat]
      validate: {
        validator: (v: number[]) => Array.isArray(v) && v.length === 2,
        message: "geo.coordinates must be [lng, lat]"
      }
    }
  },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    type: { type: String, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, default: 0 },
    images: [{ type: String }],

    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, required: true }
    },

    // NEW: text label + point
    location: { type: String },            // not required
    geo: { type: GeoSchema, default: null },

    // moderation + workflow
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    agent: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);

// Geo index on geo (NOT on "location" text)
PropertySchema.index({ geo: "2dsphere" });

export const Property = mongoose.model<IProperty>("Property", PropertySchema);
