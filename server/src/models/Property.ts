import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description?: string;
  price: number;          // in your base currency (e.g., TRY, USD)
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
  bedrooms: number;
  bathrooms: number;
  sqft?: number;          // or squareMeters?: number;
  images: string[];       // store URLs
  listedAt: Date;
  isActive: boolean;

  agent?: mongoose.Types.ObjectId;
}

const AddressSchema = new Schema<IProperty['address']>(
  {
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    postalCode: { type: String, trim: true },
  },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    address: { type: AddressSchema, required: true },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    sqft: { type: Number, min: 0 },
    images: { type: [String], default: [] },
    listedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    agent: {type: Schema.Types.ObjectId, ref:'Agent'}
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Avoid OverwriteModelError in watch-mode/TS-node
export const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
