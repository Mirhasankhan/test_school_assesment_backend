import Express from "express";
import { userController } from "./user.controller";

const router = Express.Router();

router.post("/create", userController.createUser);
router.post("/signup-verification", userController.signupVerification);
router.get("/userinfo/:userId", userController.userInfo);

export const userRoute = router;
