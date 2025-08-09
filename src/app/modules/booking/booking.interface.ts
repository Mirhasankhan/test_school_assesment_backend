import { Types } from "mongoose";

export type TBooking = {
  _id?: string;
  service: string | Types.ObjectId;
  user: string | Types.ObjectId;
  worker: string | Types.ObjectId;
  dateTime: Date;
  paymentStatus: boolean;
  paymentMethodId: string;
  bookingStatus: string;
  cancelReason: string;
};
