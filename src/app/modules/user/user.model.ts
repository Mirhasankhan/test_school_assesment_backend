import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

export const role = {
  admin: "Admin",
  user: "User",
  pro: "Pro",
};

const userSchema = new Schema<TUser>(
  {
    fullName: {
      type: String,
      required: [true, "Fullname is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin", "Pro"],
    },
    profileImage: {
      type: String,
      required: false,
      default: null,
    },
    isSetup: {
      type: Boolean,
      default: false,
    },
    dob: {
      type: String,
      required: false,
      default: null,
    },
    gender: {
      type: String,
      required: false,
      default: null,
    },
    address: {
      type: String,
      required: false,
      default: null,
    },
    about: {
      type: String,
      required: false,
      default: null,
    },
    customerId: {
      type: String,
      required: false,
      default: null,
    },
    avgRating: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model<TUser>("User", userSchema);
