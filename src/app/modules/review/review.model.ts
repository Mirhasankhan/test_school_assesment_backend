import { model, Schema } from "mongoose";
import { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: { type: String, required: false },
    bookingId: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
    },
    service: {
      type: Schema.Types.ObjectId,
      required: [true, "Service id is required"],
      ref: "Service",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Review = model<TReview>("Review", reviewSchema);
