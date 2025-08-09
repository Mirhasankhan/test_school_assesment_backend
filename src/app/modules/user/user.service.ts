import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { User } from "./user.model";
import bcrypt from "bcrypt";
import { TUser } from "./user.interface";
import redisClient from "../../utils/radis";
import generateOTP from "../../utils/generateOtp";
import sendEmail from "../../utils/email";
import { Service } from "../service/service.model";
import { Review } from "../review/review.model";

const createUser = async (payload: TUser) => {
  const { email, password } = payload;

  const isExist = await User.findOne({ email });

  if (isExist) {
    throw new AppError(httpStatus.NOT_FOUND, `Email already exist`);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const pendingUserData = {
    email: payload.email,
    fullName: payload.fullName,
    phoneNumber: payload.phoneNumber,
    password: hashedPassword,
    role: payload.role,
  };

  await redisClient.set(
    `pendingUser:${payload.email}`,
    JSON.stringify(pendingUserData),
    { EX: 300 }
  );

  const otp = generateOTP();
  const subject = "Account verification OTP";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Hi <b>${payload.fullName}</b>,</p>
      <p>Your OTP for password reset is:</p>
      <h1 style="color: #007BFF;">${otp}</h1>
      <p>This OTP is valid for <b>5 minutes</b>. If you did not request this, please ignore this email.</p>
      <p>Thanks, <br>The Support Team</p>
    </div>
  `;

  await sendEmail(payload.email, subject, html);
  await redisClient.set(`otp:${payload.email}`, otp, { EX: 300 });

  return otp;
};

const signupVerification = async (payload: { email: string; otp: string }) => {
  const { email, otp } = payload;

  const savedOtp = await redisClient.get(`otp:${email}`);
  if (!savedOtp) {
    throw new AppError(400, "Invalid or expired OTP.");
  }

  if (otp !== savedOtp) {
    throw new AppError(401, "Invalid OTP.");
  }

  const pendingUserStr = await redisClient.get(`pendingUser:${email}`);
  if (!pendingUserStr) {
    throw new AppError(404, "No pending user found. Please sign up again.");
  }
  const pendingUser = JSON.parse(pendingUserStr);

  await User.create({
    email: pendingUser.email,
    fullName: pendingUser.fullName,
    password: pendingUser.password,
    phoneNumber: pendingUser.phoneNumber,
    role: pendingUser.role,
  });

  await Promise.all([
    redisClient.del(`otp:${email}`),
    redisClient.del(`pendingUser:${email}`),
  ]);

  return;
};

const userInfo = async (userId: string) => {
  const user = await User.findById({
    _id: userId,
  }).select("_id fullName profileImage about avgRating");
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const services = await Service.find({ user: userId }).select("_id");
  const serviceIds = services.map((s) => s._id);

  const reviews = await Review.find({ service: { $in: serviceIds } })
    .populate("user", "_id fullName profileImage")
    .sort({ createdAt: -1 });

  return {
    ...user.toObject(),
    reviews,
  };
};

export const userService = {
  createUser,
  signupVerification,
  userInfo,
};
