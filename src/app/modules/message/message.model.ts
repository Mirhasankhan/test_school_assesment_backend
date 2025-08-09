import { model, Schema } from "mongoose";
import { TMessage } from "./message.interface";

const messageSchema = new Schema<TMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: [true, "Sender ID is required"],
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: [true, "Receiver ID is required"],
      ref: "User",
    },
    content: {
      type: String,
      default: null,
    },
    fileUrl: {
      type: [String],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Message = model<TMessage>("Message", messageSchema);
