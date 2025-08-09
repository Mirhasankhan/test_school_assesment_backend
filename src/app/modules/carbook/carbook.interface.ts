import { Types } from "mongoose";

export type TCarbook = {
  _id?: string;
  user: string | Types.ObjectId;
  car: string | Types.ObjectId;
  bookingStatus: string;
  dateTime: Date;
};
