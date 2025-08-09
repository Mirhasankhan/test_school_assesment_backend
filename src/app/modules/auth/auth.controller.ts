import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const result = await authServices.forgetPasswordFromDB(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `Please check your email (${email}) to reset your password`,
    data: result,
  });
});

const verifyForgotPassword = catchAsync(async (req, res) => {
  const payload = req.body;
  const response = await authServices.verifyForgotPassword(payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified successfully.",
    data: response,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.id;
  await authServices.resetForgotPassword(newPassword, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User password reset successfully",
  });
});

const userLocationUpdateInRedis = catchAsync(async (req, res) => {
  const { id } = req.user;
  await authServices.userLocationUpdateInRedis(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your location updated successfully",
  });
});

const updateProfile = catchAsync(async (req, res) => {
  await authServices.updateProfile(req.user.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile update successfully",
  });
});

const updateProfileImage = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;
  await authServices.updateProfileImage(req.user.id, file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile update successfully",
  });
});

const myProfile = catchAsync(async (req, res) => {
  const result = await authServices.myProfile(req.user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile info retrived successfully",
    data: result,
  });
});

export const authController = {
  loginUser,
  forgetPassword,
  resetPassword,
  verifyForgotPassword,
  userLocationUpdateInRedis,
  updateProfile,
  updateProfileImage,
  myProfile,
};
