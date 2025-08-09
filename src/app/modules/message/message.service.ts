import { Request } from "express";
import { TMessage } from "./message.interface";
import { Message } from "./message.model";
import { uploadInSpace } from "../../utils/uploadInSpace";

const createMessage = async (data: TMessage) => {
  await Message.create(data);
  return;
};

const urlGenerate = async (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const processImages = async (files?: Express.Multer.File[]) => {
    if (!files || files.length === 0) return null;
    return Promise.all(
      files.map((file) => uploadInSpace(file, "messages/files"))
    );
  };

  const [fileUrl] = await Promise.all([processImages(files["fileUrl"])]);

  return fileUrl;
};

const getAllMessages = async () => {
  const results = await Message.find();
  return results;
};

const getMessageById = async (id: string) => {
  const result = await Message.findOne({ _id: id });
  return result;
};

const updateMessage = async (id: string, data: Partial<TMessage>) => {
  await Message.findOneAndUpdate({ _id: id }, data, { new: true });
  return;
};

const deleteMessage = async (id: string) => {
  await Message.findOneAndDelete({ _id: id });
  return;
};

export const messageServices = {
  urlGenerate,
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
};
