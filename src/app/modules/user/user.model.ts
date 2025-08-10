import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

export const role = {
  admin: "Admin",
  user: "User",
};

const userSchema = new Schema<TUser>(
  {
    fullName: { type: String, required: [true, "Fullname is required"] },
    email: { type: String, required: [true, "Email is required"] },
    phoneNumber: { type: String, required: [true, "Phone number is required"] },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin", "Pro"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model<TUser>("User", userSchema);

const pendingUserSchema = new Schema<TUser>(
  {
    fullName: { type: String, required: [true, "Fullname is required"] },
    email: { type: String, required: [true, "Email is required"] },
    phoneNumber: { type: String, required: [true, "Phone number is required"] },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin", "Pro"],
    },
    otp: { type: String },
    expiresAt: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const PendingUser = model<TUser>("PendingUser", pendingUserSchema);

const otpSchema = new Schema<TUser>(
  {
    email: { type: String, required: [true, "Email is required"] },
    otp: { type: String },
    expiresAt: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Otp = model<TUser>("Otp", otpSchema);
