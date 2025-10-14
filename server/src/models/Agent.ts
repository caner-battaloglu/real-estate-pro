import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAgent extends Document {
  user: Types.ObjectId;
  company?: string;
  phone?: string;
  bio?: string;
  profilePhoto?: string;
  socialLinks?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    bio: { type: String, trim: true },
    profilePhoto: { type: String, trim: true },
    socialLinks: { type: Object, default: {} },
  },
  { timestamps: true }
);

export const Agent = mongoose.model<IAgent>("Agent", AgentSchema);
