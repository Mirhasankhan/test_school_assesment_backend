import express from "express";
import { reviewControllers } from "./review.controller";
import auth from "../../middleware/auth";
import { role } from "../user/user.model";

const router = express.Router();

router.post(
  "/create/:bookingId",
  auth(role.user),
  reviewControllers.createReview
);
router.get("/", auth(), reviewControllers.getAllReviews);
router.get("/:id", auth(), reviewControllers.getReviewById);
router.patch("/:id", auth(), reviewControllers.updateReview);
router.delete("/:id", auth(), reviewControllers.deleteReview);

export const reviewRoutes = router;
