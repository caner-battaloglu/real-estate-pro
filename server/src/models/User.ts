import bcrypt from "bcryptjs";
import { Schema, model, Document, Types } from "mongoose";
import crypto from "crypto";

export type AppRole = "public" | "agent" | "admin";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: AppRole;
  isActive: boolean;
  favorites: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;


  refreshTokenHash?: string | null;
  refreshTokenExpiresAt?: Date | null;

  passwordResetTokenHash?: string | null;
  passwordResetExpiresAt?: Date | null;

  emailVerifyTokenHash?: string | null;
  emailVerifyExpiresAt?: Date | null;
  emailVerifiedAt?: Date | null;

  // methods
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
      index: true,
      validate: {
        validator: (v: string) => /^\S+@\S+\.\S+$/.test(v),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // do not return by default
    },
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    role: { type: String, enum: ["public", "agent", "admin"], default: "public" },
    isActive: { type: Boolean, default: true },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Property" }],


    refreshTokenHash: { type: String, default: null, select: false },
    refreshTokenExpiresAt: { type: Date, default: null },

    passwordResetTokenHash: { type: String, default: null, select: false },
    passwordResetExpiresAt: { type: Date, default: null },

    emailVerifyTokenHash: { type: String, default: null, select: false },
    emailVerifyExpiresAt: { type: Date, default: null },
    emailVerifiedAt: { type: Date, default: null },
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

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // this.password is selected:false; ensure you selected it when querying!
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual full name
UserSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName ?? ""} ${this.lastName ?? ""}`.trim();
});

UserSchema.set("toJSON", { virtuals: true });

export const User = model<IUser>("User", UserSchema);

// Tiny helpers you might reuse elsewhere
export function sha256(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}
export function randomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("hex");
}
