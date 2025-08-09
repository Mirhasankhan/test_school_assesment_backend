import { Types } from "mongoose";

export type TFavourite = {
  _id?: string;
  service: string | Types.ObjectId;
  user: string | Types.ObjectId;
};
