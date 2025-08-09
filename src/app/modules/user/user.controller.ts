import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP Send Successfully",
    data: user,
  });
});

const signupVerification = catchAsync(async (req, res) => {
  await userService.signupVerification(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User created successfull",
  });
});

const userInfo = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await userService.userInfo(userId);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Userinfo retrived successfull",
    data: user,
  });
});

export const userController = {
  createUser,
  signupVerification,
  userInfo,
};
