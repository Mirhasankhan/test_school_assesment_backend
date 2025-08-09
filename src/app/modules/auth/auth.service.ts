import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../../config";
import AppError from "../../utils/AppError";
import { TLoginUser } from "./auth.interface";
import { User } from "../user/user.model";
import sendEmail from "../../utils/email";
import generateOTP from "../../utils/generateOtp";
import redisClient from "../../utils/radis";
import { jwtHelpers } from "../../utils/jwtHelpers";
import { TUser } from "../user/user.interface";
import { uploadInSpace } from "../../utils/uploadInSpace";

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, ` User not found `);
  }

  // Compare the provided password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid password");
  }

  const isSetup =
    user.fullName !== null &&
    user.dob !== null &&
    user.gender !== null &&
    user.address !== null;

  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const returnUser = {
    id: user?._id,
    email: user.email,
    role: user.role,
    isSetup: isSetup ? true : false,
  };

  // generate access token
  const accessToken = jwt.sign(jwtPayload, config.jwt.jwt_secret as string, {
    expiresIn: config.jwt.expires_in,
  });

  return {
    accessToken,
    userInfo: returnUser,
  };
};

const forgetPasswordFromDB = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `user not found with this ${email}`
    );
  }

  const otp = generateOTP();
  const subject = "Reset Password";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Hi <b>${user.fullName}</b>,</p>
      <p>Your OTP for password reset is:</p>
      <h1 style="color: #007BFF;">${otp}</h1>
      <p>This OTP is valid for <b>5 minutes</b>. If you did not request this, please ignore this email.</p>
      <p>Thanks, <br>The Support Team</p>
    </div>
  `;

  await sendEmail(email, subject, html);
  await redisClient.set(`otp:${email}`, otp, { EX: 300 });
  return otp;
};

const verifyForgotPassword = async (payload: {
  email: string;
  otp: string;
}) => {
  const { email, otp } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const userId = user.id;

  const savedOtp = await redisClient.get(`otp:${email}`);
  if (!savedOtp) {
    throw new AppError(400, "Invalid or expired OTP.");
  }

  if (otp !== savedOtp) {
    throw new AppError(401, "Invalid OTP.");
  }

  await redisClient.del(`otp:${email}`);

  const forgetToken = jwtHelpers.generateToken(
    { id: userId, email, role: user.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return { forgetToken };
};

const resetForgotPassword = async (newPassword: string, userId: string) => {
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.jwt.gen_salt)
  );

  await User.findByIdAndUpdate(
    { _id: userId },
    { $set: { password: hashedPassword } }
  );
  return;
};

const userLocationUpdateInRedis = async (
  userId: string,
  userLocation: { longitude: number; latitude: number }
) => {
  const redisGeoKey = "userLocations";

  await redisClient.geoAdd(redisGeoKey, {
    longitude: userLocation.longitude,
    latitude: userLocation.latitude,
    member: userId,
  });

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

const myProfile = async (userId: string) => {
  const profileInfo = await User.findById({
    _id: userId,
  }).select("_id fullName email phoneNumber role profileImage gender");

  if (!profileInfo) {
    throw new AppError(404, "User not found");
  }
  const redisGeoKey = "userLocations";
  const location = await redisClient.geoPos(redisGeoKey, userId);

  const [geo] = location;

  return {
    ...profileInfo.toObject(),
    location: geo
      ? { longitude: Number(geo.longitude), latitude: Number(geo.latitude) }
      : null,
  };
};

export const authServices = {
  loginUser,
  forgetPasswordFromDB,
  verifyForgotPassword,
  resetForgotPassword,
  userLocationUpdateInRedis,
  updateProfile,
  updateProfileImage,
  myProfile,
};
