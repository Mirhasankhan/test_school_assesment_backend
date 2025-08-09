import { Types } from "mongoose";

export type TService = {
  _id?: string;
  user: string | Types.ObjectId;
  servicePhoto: string;
  serviceName: string;
  category: string | Types.ObjectId;
  description: string;
  address?: {
    type: "Point";
    coordinates: [number, number];
  };
  price: number;
};
