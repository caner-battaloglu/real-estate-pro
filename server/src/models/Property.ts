import { Schema, model, Document, Types } from "mongoose";

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface IProperty extends Document {
  title: string;
  description?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  propertyType?: "house" | "apartment" | "condo" | "land" | "other";
  address: Address;
  location?: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
  listed: boolean;
  isDeleted: boolean;
  agent: Types.ObjectId;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<Address>(
  {
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"], // <-- custom message
    },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    areaSqm: { type: Number, min: 0 },
    propertyType: {
      type: String,
      enum: ["house", "apartment", "condo", "land", "other"],
      default: "other",
    },
    address: { type: AddressSchema, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: undefined }, // [lng, lat]
    },
    listed: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

PropertySchema.index({ "address.city": 1, price: 1 });
PropertySchema.index({ location: "2dsphere" });

export const Property = model<IProperty>("Property", PropertySchema);
