import express from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";
import { role } from "../user/user.model";

const router = express.Router();

router.post(
  "/create/:serviceId",
  auth(role.user),
  bookingControllers.createBooking
);
router.get(
  "/client-bookings",
  auth(role.user),
  bookingControllers.clientBookings
);
router.get(
  "/worker-bookings",
  auth(role.pro),
  bookingControllers.workerBookings
);
router.get("/:id", auth(), bookingControllers.getBookingById);
router.patch(
  "/cancel-booking-user/:bookingId",
  auth(role.user),
  bookingControllers.cancelBookingByUser
);
router.patch("/:id", auth(role.user), bookingControllers.updateBooking);
router.delete("/:id", auth(), bookingControllers.deleteBooking);

export const bookingRoutes = router;
