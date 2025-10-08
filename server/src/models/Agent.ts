import { Schema, model, Document } from "mongoose";

export interface IAgent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  agency?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
}

const AgentSchema = new Schema<IAgent>(
  {
    firstName: { type: String, required: [true, "First name is required"], trim: true },
    lastName: { type: String, required: [true, "Last name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: (props: any) => `${props.value} is not a valid email address!`
      }
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => /^\+?[0-9\s\-()]{7,20}$/.test(value),
        message: (props: any) => `${props.value} is not a valid phone number!`
      }
    },
    agency: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

AgentSchema.virtual("fullName").get(function (this: IAgent) {
  return `${this.firstName} ${this.lastName}`.trim();
});

export const Agent = model<IAgent>("Agent", AgentSchema);
