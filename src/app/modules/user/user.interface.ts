import { Types } from "mongoose";
type TUserLevel ="None"|"A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type TUser = {
  _id?: Types.ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  currentLevel: TUserLevel;
  currentStep:number;
  password: string;
  otp: string;
  isBlocked: boolean;
  role: string;
  expiresAt: Date;
};
