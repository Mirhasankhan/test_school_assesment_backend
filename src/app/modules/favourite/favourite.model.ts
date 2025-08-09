import { model, Schema } from "mongoose";
import { TFavourite } from "./favourite.interface";

const favouriteSchema = new Schema<TFavourite>(
  {
    service: {
      type: Schema.Types.ObjectId,
      required: [true, "Service ID is required"],
      ref: "Service",
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

favouriteSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "service",
});
favouriteSchema.set("toObject", { virtuals: true });
favouriteSchema.set("toJSON", { virtuals: true });

export const Favourite = model<TFavourite>("Favourite", favouriteSchema);
