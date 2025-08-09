import { roomServices } from "./room.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createRoom = catchAsync(async (req, res) => {
  await roomServices.createRoom(req.body, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Room created successfully",
  });
});

const getAllRooms = catchAsync(async (req, res) => {
  const result = await roomServices.getAllRooms();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All rooms fetched successfully",
    data: result,
  });
});

const getRoomById = catchAsync(async (req, res) => {
  const result = await roomServices.getRoomById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Room fetched successfully",
    data: result,
  });
});

const updateRoom = catchAsync(async (req, res) => {
  await roomServices.updateRoom(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Room updated successfully",
  });
});

const deleteRoom = catchAsync(async (req, res) => {
  await roomServices.deleteRoom(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Room deleted successfully",
  });
});

export const roomControllers = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
