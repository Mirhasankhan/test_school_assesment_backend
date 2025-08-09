import AppError from "../../utils/AppError";
import { Booking } from "../booking/booking.model";
import { Service } from "../service/service.model";
import { User } from "../user/user.model";
import { TReview } from "./review.interface";
import { Review } from "./review.model";

const createReview = async (
  data: TReview,
  userId: string,
  bookingId: string
) => {
  const reviewExist = await Review.findOne({
    bookingId,
  });
  if (reviewExist) {
    throw new AppError(400, "Review already exist");
  }

  const bookingExist = await Booking.findOne({
    _id: bookingId,
  });
  if (!bookingExist) {
    throw new AppError(400, "Booking not found");
  }

  await Review.create({
    ...data,
    service: bookingExist.service,
    bookingId,
    user: userId,
  });

  const service = await Service.findById({
    _id: bookingExist.service,
  });
  if (!service) {
    throw new AppError(404, "Service not found");
  }

  const userServices = await Service.find({ user: service.user }).select("_id");
  const serviceIds = userServices.map((s) => s._id);

  const allReviews = await Review.find({ service: { $in: serviceIds } });

  const ratings = allReviews.map((r) => r.rating);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

  // 5. Update avgRating in the User model
  await User.findByIdAndUpdate(service.user, {
    avgRating: parseFloat(avgRating.toFixed(2)),
  });
  return;
};

const getAllReviews = async () => {
  const results = await Review.find();
  return results;
};

const getReviewById = async (id: string) => {
  const result = await Review.findOne({ _id: id });
  return result;
};

const updateReview = async (id: string, data: Partial<TReview>) => {
  await Review.findOneAndUpdate({ _id: id }, data, { new: true });
  return;
};

const deleteReview = async (id: string) => {
  await Review.findOneAndDelete({ _id: id });
  return;
};

export const reviewServices = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
