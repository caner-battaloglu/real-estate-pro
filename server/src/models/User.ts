import bcrypt = require("bcryptjs");
import { Schema, model, Document, Types } from "mongoose";


export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "public" | "agent" | "admin";
  isActive: boolean;
  favorites: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  fullName: string;
}

const UserSchema = new Schema<IUser>(
  {
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true
    },
    lastName: {
      type: String,
      required: [true,"Last name is required"],
      trim: true
    },
    role: {
      type: String,
      enum: ["public", "agent", "admin"],
      default: "public"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: "Property"
    }]
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
UserSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Ensure virtuals are included in JSON
UserSchema.set("toJSON", { virtuals: true });

export const User = model<IUser>("User", UserSchema);
