import { TRoom } from "./room.interface";
import { Room } from "./room.model";

const createRoom = async (data: TRoom, userId: string) => {
  await Room.create(data);
  return;
};

const getAllRooms = async () => {
  const results = await Room.find();
  return results;
};

const getRoomById = async (id: string) => {
  const result = await Room.findOne({ _id: id });
  return result;
};

const updateRoom = async (id: string, data: Partial<TRoom>) => {
  await Room.findOneAndUpdate({ _id: id }, data, { new: true });
  return;
};

const deleteRoom = async (id: string) => {
  await Room.findOneAndDelete({ _id: id });
  return;
};

export const roomServices = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
