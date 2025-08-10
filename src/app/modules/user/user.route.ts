import Express from "express";
import { userController } from "./user.controller";

const router = Express.Router();

router.post("/pending", userController.createPendingUser);
router.post("/resend-otp", userController.resendOtp);
router.post("/create", userController.createUser);
router.get("/userinfo/:userId", userController.userInfo);

export const userRoute = router;
