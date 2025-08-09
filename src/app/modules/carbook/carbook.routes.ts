import express from "express";
import { carbookControllers } from "./carbook.controller";
import auth from "../../middleware/auth";
import { role } from "../user/user.model";

const router = express.Router();

router.post(
  "/book/:carId",
  auth(role.user, role.pro),
  carbookControllers.createCarbook
);
router.get("/", auth(role.user), carbookControllers.myCarBooks);
router.get("/:id", auth(), carbookControllers.getCarbookById);
router.patch("/:id", auth(), carbookControllers.updateCarbook);
router.delete("/:id", auth(), carbookControllers.deleteCarbook);

export const carbookRoutes = router;
