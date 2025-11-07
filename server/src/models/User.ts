import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export type AppRole = "user" | "agent" | "admin";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: AppRole;
  isActive: boolean;
  favorites: Types.ObjectId[];
  
  // Agent-specific fields
  phone?: string;
  bio?: string;
  specialties?: string[];
  experience?: number;
  avatar?: string;
  rating?: number;
  propertiesSold?: number;

  // Session + security
  refreshTokenHash?: string | null;
  refreshTokenExpiresAt?: Date | null;

  // Password reset + email verify
  passwordResetTokenHash?: string | null;
  passwordResetExpiresAt?: Date | null;
  emailVerifyTokenHash?: string | null;
  emailVerifyExpiresAt?: Date | null;
  emailVerifiedAt?: Date | null;

  // New workflow flags
  mustChangePassword: boolean;
  createdByAdmin: boolean;

  comparePassword(candidatePassword: string): Promise<boolean>;
  fullName: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => /^\S+@\S+\.\S+$/.test(v),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    role: { type: String, enum: ["user", "agent", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Property" }],

    // Agent-specific fields
    phone: { type: String, trim: true },
    bio: { type: String, trim: true },
    specialties: [{ type: String, trim: true }],
    experience: { type: Number, min: 0 },
    avatar: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    propertiesSold: { type: Number, min: 0, default: 0 },

    // session + security
    refreshTokenHash: { type: String, default: null, select: false },
    refreshTokenExpiresAt: { type: Date, default: null },

    // password reset + email verify
    passwordResetTokenHash: { type: String, default: null, select: false },
    passwordResetExpiresAt: { type: Date, default: null },
    emailVerifyTokenHash: { type: String, default: null, select: false },
    emailVerifyExpiresAt: { type: Date, default: null },
    emailVerifiedAt: { type: Date, default: null },

    // workflow flags
    mustChangePassword: { type: Boolean, default: false },
    createdByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password if modified
UserSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName ?? ""} ${this.lastName ?? ""}`.trim();
});

UserSchema.set("toJSON", { virtuals: true });

export const User = mongoose.model<IUser>("User", UserSchema);

// Small helpers
export function sha256(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}
export function randomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("hex");
}
