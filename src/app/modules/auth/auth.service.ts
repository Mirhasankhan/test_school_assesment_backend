import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../../config";
import AppError from "../../utils/AppError";
import { TLoginUser } from "./auth.interface";
import { Otp, User } from "../user/user.model";
import sendEmail from "../../utils/email";
import generateOTP from "../../utils/generateOtp";
import { TUser } from "../user/user.interface";
import { uploadInSpace } from "../../utils/uploadInSpace";
import { jwtHelpers } from "../../utils/jwtHelpers";
import { emailBodyOtp } from "../../middleware/EmailBody";

const loginUserIntoDB = async (payload: any) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid credentials");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );
  const userObj = user.toObject();

  const { password, ...userInfo } = userObj;

  return {
    accessToken,
    userInfo,
  };
};

const sendForgotPasswordOtpDB = async (email: string) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new AppError(404, "User not found");
  }

  const otp = generateOTP();
  const OTP_EXPIRATION_TIME = 5 * 60 * 1000;
  const expiresAt = Date.now() + OTP_EXPIRATION_TIME;

  const subject = "Your Password Reset OTP";
  const html = emailBodyOtp(existingUser.fullName, otp);

  await sendEmail(email, subject, html);

  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt: new Date(expiresAt) },
    { upsert: true, new: true }
  );

  return otp;
};

const verifyForgotPasswordOtpCode = async (payload: any) => {
  const { email, otp } = payload;

  if (!email || !otp) {
    throw new AppError(400, "Email and OTP are required.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  const verifyData = await Otp.findOne({ email });
  if (!verifyData) {
    throw new AppError(400, "Invalid or expired OTP.");
  }
  const { expiresAt } = verifyData;

  if (otp !== verifyData.otp) {
    throw new AppError(401, "Invalid OTP.");
  }

  if (Date.now() > expiresAt.getTime()) {
    await Otp.deleteOne({ email });
    throw new AppError(410, "OTP has expired. Please request a new OTP.");
  }
  await Otp.deleteOne({ email });

  const accessToken = jwtHelpers.generateToken(
    { id: user._id, email },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return { accessToken };
};

const resetPasswordIntoDB = async (newPassword: string, userId: string) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new AppError(404, "User not found");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.jwt.gen_salt)
  );

  existingUser.password = hashedPassword;
  await existingUser.save();

  return;
};

const userLocationUpdateInRedis = async (
  userId: string,
  userLocation: { longitude: number; latitude: number }
) => {
  const redisGeoKey = "userLocations";

  return;
};

const updateProfile = async (userId: string, payload: TUser) => {
  await User.findByIdAndUpdate(userId, payload, { new: true });
  return;
};

const updateProfileImage = async (
  userId: string,
  file: Express.Multer.File
) => {
  if (file === undefined) {
    throw new AppError(400, "Please select image");
  }
  const profileImage = await uploadInSpace(file, "users/photos");
  await User.findByIdAndUpdate(
    {
      _id: userId,
    },
    { profileImage }
  );
  return;
};

export const authServices = {
  loginUserIntoDB,
  sendForgotPasswordOtpDB,
  verifyForgotPasswordOtpCode,
  resetPasswordIntoDB,
  userLocationUpdateInRedis,
  updateProfile,
  updateProfileImage,
};
