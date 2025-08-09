import { model, Schema } from "mongoose";
import { TRoom } from "./room.interface";

const roomSchema = new Schema<TRoom>(
  {
    user1: {
      type: Schema.Types.ObjectId,
      required: [true, "User 1 ID is required"],
      ref: "User",
    },
    user2: {
      type: Schema.Types.ObjectId,
      required: [true, "User 2 ID is required"],
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Room = model<TRoom>("Room", roomSchema);
