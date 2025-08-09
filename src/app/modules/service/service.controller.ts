import { serviceServices } from "./service.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createService = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;
  await serviceServices.createService(req.body, req.user.id, file);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Service created successfully",
  });
});

const myServices = catchAsync(async (req, res) => {
  const result = await serviceServices.myServices(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All services fetched successfully",
    data: result,
  });
});

const getServiceById = catchAsync(async (req, res) => {
  const result = await serviceServices.getServiceById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service fetched successfully",
    data: result,
  });
});

const updateService = catchAsync(async (req, res) => {
  await serviceServices.updateService(req.params.id, req.user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service updated successfully",
  });
});

const deleteService = catchAsync(async (req, res) => {
  await serviceServices.deleteService(req.params.id, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service deleted successfully",
  });
});

const allServices = catchAsync(async (req, res) => {
  const services = await serviceServices.allServices(req.query, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Services retrived successfully",
    data: services,
  });
});

export const serviceControllers = {
  createService,
  myServices,
  getServiceById,
  updateService,
  deleteService,
  allServices,
};
