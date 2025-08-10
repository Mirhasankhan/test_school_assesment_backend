import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";
import { fileUploader } from "../../utils/fileUploader";

const router = express.Router();
router.post("/login", authController.loginUser);
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.patch("/reset-password", auth(), authController.resetPassword);
router.patch("/update-profile", auth(), authController.updateProfile);
router.patch(
  "/update-profile-image",
  auth(),
  fileUploader.profileImage,
  authController.updateProfileImage
);
router.patch(
  "/location-update",
  auth(),
  validateRequest(authValidation.locationUpdateSchema),
  authController.userLocationUpdateInRedis
);

export const authRoutes = router;
