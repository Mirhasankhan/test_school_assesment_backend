import { reviewServices } from "./review.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createReview = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  await reviewServices.createReview(req.body, req.user.id, bookingId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review created successfully",
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const result = await reviewServices.getAllReviews();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All reviews fetched successfully",
    data: result,
  });
});

const getReviewById = catchAsync(async (req, res) => {
  const result = await reviewServices.getReviewById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review fetched successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req, res) => {
  await reviewServices.updateReview(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review updated successfully",
  });
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewServices.deleteReview(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review deleted successfully",
  });
});

export const reviewControllers = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
