import { Types } from "mongoose";

export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface TOption {
  _id?: Types.ObjectId;
  text: string;
}

export interface TQuestion {
  _id?: Types.ObjectId;
  text: string;
  level: Level;
  options: TOption[];
  correctOptionId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateQuestionPayload {
  text: string;
  level: Level;
  options: { text: string }[];
  correctOptionIndex: number;
}
