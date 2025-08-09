import { model, Schema } from "mongoose";
import { TCarbook } from "./carbook.interface";

const carbookSchema = new Schema<TCarbook>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    car: { type: Schema.Types.ObjectId, required: true, ref: "Carstore" },
    dateTime: { type: Date, required: true },
    bookingStatus: { type: String, required: false, default: "Pending" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Carbook = model<TCarbook>("Carbook", carbookSchema);
