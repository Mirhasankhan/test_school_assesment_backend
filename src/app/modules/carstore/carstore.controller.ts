import { carstoreServices } from "./carstore.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createCarstore = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  await carstoreServices.createCarstore(req.body, req.user.id, files);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Car created successfully",
  });
});

const getAllCarstores = catchAsync(async (req, res) => {
  const result = await carstoreServices.getAllCarstores(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All cars fetched successfully",
    data: result,
  });
});

const getCarstoreById = catchAsync(async (req, res) => {
  const result = await carstoreServices.getCarstoreById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Carstore fetched successfully",
    data: result,
  });
});

const updateCarstore = catchAsync(async (req, res) => {
  await carstoreServices.updateCarstore(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Carstore updated successfully",
  });
});

const deleteCarstore = catchAsync(async (req, res) => {
  await carstoreServices.deleteCarstore(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Carstore deleted successfully",
  });
});

export const carstoreControllers = {
  createCarstore,
  getAllCarstores,
  getCarstoreById,
  updateCarstore,
  deleteCarstore,
};
