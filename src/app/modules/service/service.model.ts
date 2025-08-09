import { model, Schema } from "mongoose";
import { TService } from "./service.interface";

const serviceSchema = new Schema<TService>(
  {
    servicePhoto: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    serviceName: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    address: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

serviceSchema.index({ address: "2dsphere" });
serviceSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "service",
});
serviceSchema.set("toObject", { virtuals: true });
serviceSchema.set("toJSON", { virtuals: true });

export const Service = model<TService>("Service", serviceSchema);
