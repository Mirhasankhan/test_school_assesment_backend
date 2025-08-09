import { Types } from "mongoose";

export type TCarstore = {
  _id?: string;
  carName: string;
  carModel: string;
  carImages: string[];
  description: string;
  price: number;
  releaseYear: number;
  carType: string;
  user: string | Types.ObjectId;
};
