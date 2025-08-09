import { Types } from "mongoose";

export type TReview = {
  _id?: string;
  user: string | Types.ObjectId;
  bookingId: string;
  service: string | Types.ObjectId;
  rating: number;
  comment: string;
};
