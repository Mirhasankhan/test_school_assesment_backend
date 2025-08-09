import { messageServices } from "./message.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createMessage = catchAsync(async (req, res) => {
  await messageServices.createMessage(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Message created successfully",
  });
});

const generateFileUrl = catchAsync(async (req, res) => {
  const fileUrl = await messageServices.urlGenerate(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "File URL generated successfully",
    data: fileUrl,
  });
});

const getAllMessages = catchAsync(async (req, res) => {
  const result = await messageServices.getAllMessages();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All messages fetched successfully",
    data: result,
  });
});

const getMessageById = catchAsync(async (req, res) => {
  const result = await messageServices.getMessageById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Message fetched successfully",
    data: result,
  });
});

const updateMessage = catchAsync(async (req, res) => {
  await messageServices.updateMessage(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Message updated successfully",
  });
});

const deleteMessage = catchAsync(async (req, res) => {
  await messageServices.deleteMessage(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Message deleted successfully",
  });
});

export const messageControllers = {
  createMessage,
  generateFileUrl,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
};
