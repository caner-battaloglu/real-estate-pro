// src/models/Agent.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAgent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  agency?: string;
  licenseNumber?: string;
  avatarUrl?: string;
  role: 'agent' | 'admin';
  isActive: boolean;

  // Virtuals
  fullName: string;
}

const AgentSchema = new Schema<IAgent>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) =>
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
        message: (props: any) => `${props.value} is not a valid email!`,
      },
    },

    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => {
          // Allows +, digits, spaces, dashes, parentheses
          return /^\+?[0-9\s\-()]{7,20}$/.test(value);
        },
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
    },

    agency: { type: String, trim: true },

    licenseNumber: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null/undefined values
      trim: true,
    },

    avatarUrl: { type: String, trim: true },

    role: {
      type: String,
      enum: ['agent', 'admin'],
      default: 'agent',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: fullName
AgentSchema.virtual('fullName').get(function (this: IAgent) {
  return `${this.firstName} ${this.lastName}`;
});

// Explicit indexes
AgentSchema.index({ email: 1 }, { unique: true });
AgentSchema.index({ licenseNumber: 1 }, { unique: true, sparse: true });

export const Agent: Model<IAgent> =
  mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);
