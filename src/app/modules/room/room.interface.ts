import { Types } from "mongoose";

export type TRoom = {
  _id?: string;
  user1: string | Types.ObjectId;
  user2?: string | Types.ObjectId;
};
