import { TSlots } from "./slots.interface";
import { Slot } from "./slots.model";

const createSlots = async (payload: TSlots[], userId: string) => {
  const incomingDays = payload.map((slot) => slot.day.toLowerCase());

  const existingSlots = await Slot.find({
    userId,
    day: { $in: incomingDays },
  });

  const existingDays = new Set(
    existingSlots.map((slot) => slot.day.toLowerCase())
  );

  const newSlots = payload.filter(
    (slot) => !existingDays.has(slot.day.toLowerCase())
  );

  if (newSlots.length === 0) return;

  const slotsWithUser = newSlots.map((slot) => ({
    ...slot,
    userId,
  }));

  await Slot.insertMany(slotsWithUser);
};

const updateSlot = async (slotId: string, userId: string, payload: TSlots) => {
  await Slot.findOneAndUpdate(
    { _id: slotId, userId: userId },
    { ...payload },
    { new: true }
  );
  return;
};

const mySlots = async (userId: string) => {
  const slots = await Slot.find({ userId: userId });
  return slots;
};

export const slotService = {
  createSlots,
  updateSlot,
  mySlots,
};
