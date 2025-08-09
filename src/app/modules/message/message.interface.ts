import { Types } from "mongoose";

export type TMessage = {
  _id?: string;
  sender: string | Types.ObjectId;
  receiver: string | Types.ObjectId;
  content?: string;
  fileUrl?: string[];
};
