import { categoryServices } from './category.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createCategory = catchAsync(async (req, res) => {
  await categoryServices.createCategory({ ...req.body, userId: req.user.id });
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Category created successfully",
  });
});

const getAllCategorys = catchAsync(async (req, res) => {
  const result = await categoryServices.getAllCategorys();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All categorys fetched successfully",
    data: result,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const result = await categoryServices.getCategoryById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Category fetched successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  await categoryServices.updateCategory(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Category updated successfully",
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryServices.deleteCategory(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Category deleted successfully",
  });
});

export const categoryControllers = {
  createCategory,
  getAllCategorys,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
