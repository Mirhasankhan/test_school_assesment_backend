import { model, Schema } from "mongoose";
import { TSlots } from "./slots.interface";

const slotSchema = new Schema<TSlots>(
  {
    day: {
      type: String,
      required: [true, "Day is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Slot = model<TSlots>("Slot", slotSchema);
