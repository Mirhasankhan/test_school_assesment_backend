import { carbookServices } from "./carbook.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createCarbook = catchAsync(async (req, res) => {
  const { carId } = req.params;
  await carbookServices.createCarbook(req.body, req.user.id, carId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Car booking successfully",
  });
});

const myCarBooks = catchAsync(async (req, res) => {
  const result = await carbookServices.myCarBooks(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My All carbooks fetched successfully",
    data: result,
  });
});

const getCarbookById = catchAsync(async (req, res) => {
  const result = await carbookServices.getCarbookById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Carbook fetched successfully",
    data: result,
  });
});

const updateCarbook = catchAsync(async (req, res) => {
  await carbookServices.updateCarbook(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Carbook updated successfully",
  });
});

const deleteCarbook = catchAsync(async (req, res) => {
  await carbookServices.deleteCarbook(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Carbook deleted successfully",
  });
});

export const carbookControllers = {
  createCarbook,
  myCarBooks,
  getCarbookById,
  updateCarbook,
  deleteCarbook,
};
