import express from "express";
import { revenueControllers } from "./revenue.controller";
import auth from "../../middleware/auth";
import { role } from "../user/user.model";

const router = express.Router();

router.get(
  "/worker-earnings",
  auth(role.pro),
  revenueControllers.workerEarnings
);
router.get("/:id", auth(), revenueControllers.getRevenueById);
router.patch("/:id", auth(), revenueControllers.updateRevenue);
router.delete("/:id", auth(), revenueControllers.deleteRevenue);

export const revenueRoutes = router;
