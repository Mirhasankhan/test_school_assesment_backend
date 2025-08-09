import { model, Schema } from "mongoose";
import { TCarstore } from "./carstore.interface";

const carstoreSchema = new Schema<TCarstore>(
  {
    carName: { type: String, required: [true, "Car name is required"] },
    carModel: { type: String, required: [true, "Car model is required"] },
    description: { type: String, required: [true, "Descriptin is required"] },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price minimum 1"],
    },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required"],
    },
    carType: {
      type: String,
      required: [true, "Car type is required"],
    },
    carImages: {
      type: [String],
      required: false,
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Carstore = model<TCarstore>("Carstore", carstoreSchema);
