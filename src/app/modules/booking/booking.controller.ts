import { bookingServices } from "./booking.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createBooking = catchAsync(async (req, res) => {
  await bookingServices.createBooking(
    req.body,
    req.user.id,
    req.params.serviceId
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Booking created successfully",
  });
});

const clientBookings = catchAsync(async (req, res) => {
  const { bookingStatus } = req.query as any;
  const result = await bookingServices.clientBookings(
    req.user.id,
    bookingStatus
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Client bookings retrived successfully",
    data: result,
  });
});

const workerBookings = catchAsync(async (req, res) => {
  const { bookingStatus } = req.query as any;
  const result = await bookingServices.workerBookings(
    req.user.id,
    bookingStatus
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Worker bookings retrived successfully",
    data: result,
  });
});

const cancelBookingByUser = catchAsync(async (req, res) => {
  await bookingServices.cancelBookingByUser(req.params.bookingId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking cancelled successfully",
  });
});

const getBookingById = catchAsync(async (req, res) => {
  const result = await bookingServices.getBookingById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking fetched successfully",
    data: result,
  });
});

const updateBooking = catchAsync(async (req, res) => {
  await bookingServices.updateBooking(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking updated successfully",
  });
});

const deleteBooking = catchAsync(async (req, res) => {
  await bookingServices.deleteBooking(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking deleted successfully",
  });
});

export const bookingControllers = {
  createBooking,
  clientBookings,
  workerBookings,
  cancelBookingByUser,
  getBookingById,
  updateBooking,
  deleteBooking,
};
