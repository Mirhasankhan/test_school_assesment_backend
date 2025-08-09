import { revenueServices } from "./revenue.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const workerEarnings = catchAsync(async (req, res) => {
  const result = await revenueServices.workerEarnings(
    req.user.id,
    req.query.filter as any
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Worker earnings fetched successfully",
    data: result,
  });
});

const getRevenueById = catchAsync(async (req, res) => {
  const result = await revenueServices.getRevenueById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Revenue fetched successfully",
    data: result,
  });
});

const updateRevenue = catchAsync(async (req, res) => {
  await revenueServices.updateRevenue(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Revenue updated successfully",
  });
});

const deleteRevenue = catchAsync(async (req, res) => {
  await revenueServices.deleteRevenue(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Revenue deleted successfully",
  });
});

export const revenueControllers = {
  workerEarnings,
  getRevenueById,
  updateRevenue,
  deleteRevenue,
};
