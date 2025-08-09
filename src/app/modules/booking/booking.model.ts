import { model, Schema } from "mongoose";
import { TBooking } from "./booking.interface";

const bookingStatus = [
  "Pending",
  "Accepted",
  "Completed",
  "CancelByUser",
  "CancelByAdmin",
];

const bookingSchema = new Schema<TBooking>(
  {
    service: {
      type: Schema.Types.ObjectId,
      required: [true, "Service is required"],
      ref: "Service",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    worker: {
      type: Schema.Types.ObjectId,
      required: [true, "Worker ID is required"],
      ref: "User",
    },
    dateTime: { type: Date, required: true },
    paymentStatus: {
      type: Boolean,
      required: false,
      default: false,
    },
    paymentMethodId: {
      type: String,
      required: [true, "Payment Method ID is required"],
    },
    bookingStatus: {
      type: String,
      enum: bookingStatus,
      required: true,
      default: "Pending",
    },
    cancelReason: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Booking = model<TBooking>("Booking", bookingSchema);
