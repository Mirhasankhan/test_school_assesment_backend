import { model, Schema } from "mongoose";
import { TRevenue } from "./revenue.interface";

const revenueSchema = new Schema<TRevenue>(
  {
    workerId: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Revenue = model<TRevenue>("Revenue", revenueSchema);
