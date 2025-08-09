import AppError from "../../utils/AppError";
import { User } from "../user/user.model";
import { TCarbook } from "./carbook.interface";
import { Carbook } from "./carbook.model";

const createCarbook = async (data: TCarbook, userId: string, carId: string) => {
  const userInfo = await User.findById({
    _id: userId,
  });
  if (!userInfo) {
    throw new AppError(404, "User not found");
  }

  await Carbook.create({
    ...data,
    user: userId,
    car: carId,
  });
  return;
};

const myCarBooks = async (userId: string) => {
  const results = await Carbook.find({
    user: userId,
  });
  return results;
};

const getCarbookById = async (id: string) => {
  const result = await Carbook.findOne({ _id: id });
  return result;
};

const updateCarbook = async (id: string, data: Partial<TCarbook>) => {
  await Carbook.findOneAndUpdate({ _id: id }, data, { new: true });
  return;
};

const deleteCarbook = async (id: string) => {
  await Carbook.findOneAndDelete({ _id: id });
  return;
};

export const carbookServices = {
  createCarbook,
  myCarBooks,
  getCarbookById,
  updateCarbook,
  deleteCarbook,
};
