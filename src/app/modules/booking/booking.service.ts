import AppError from "../../utils/AppError";
import stripe from "../../utils/stripe";
import { Revenue } from "../revenue/revenue.model";
import { Service } from "../service/service.model";
import { User } from "../user/user.model";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const createBooking = async (
  data: TBooking,
  userId: string,
  serviceId: string
) => {
  const isServiceExist = await Service.findById({
    _id: serviceId,
  });
  if (!isServiceExist) {
    throw new AppError(404, "Service is Not Found");
  }

  const userInfo = await User.findById({
    _id: userId,
  });
  if (!userInfo) {
    throw new AppError(404, "User not found");
  }

  let customerId = userInfo.customerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      name: userInfo.fullName,
      email: userInfo.email,
    });
    customerId = customer.id;

    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        customerId,
      },
      {
        new: true,
      }
    );

    await stripe.paymentMethods.attach(data.paymentMethodId, {
      customer: customerId,
    });
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: data.paymentMethodId,
      },
    });
  }
  await stripe.paymentMethods.attach(data.paymentMethodId, {
    customer: customerId,
  });
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: data.paymentMethodId,
    },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: isServiceExist.price * 100,
    currency: "usd",
    payment_method: data.paymentMethodId,
    customer: customerId,
    confirm: true,
    description: `Payment success for ${isServiceExist.serviceName}`,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  if (paymentIntent.status === "succeeded") {
    await Booking.create({
      ...data,
      user: userId,
      service: serviceId,
      paymentStatus: true,
      worker: isServiceExist.user,
    });

    await Revenue.create({
      workerId: isServiceExist.user,
      price: isServiceExist.price,
    });
    return;
  }
  throw new AppError(400, "Payment failed");
};

const clientBookings = async (userId: string, bookingStatus: string) => {
  const bookings = await Booking.find({
    user: userId,
    bookingStatus,
  }).populate({
    path: "service",
    select: "_id serviceName servicePhoto price reviews",
    populate: {
      path: "reviews",
      select: "rating",
    },
  });

  const results = bookings.map((booking) => {
    let service: any = booking.service;
    if (service && typeof service.toObject === "function") {
      service = service.toObject();
    }
    const reviews = service.reviews || [];
    const totalRating = reviews.reduce(
      (sum: number, r: any) => sum + (r.rating || 0),
      0
    );
    const avgRating = reviews.length ? totalRating / reviews.length : 0;

    // Remove reviews before returning
    const { reviews: _, ...serviceWithoutReviews } = service;

    return {
      ...booking.toObject(),
      service: {
        ...serviceWithoutReviews,
        avgRating,
      },
    };
  });

  return results;
};

const workerBookings = async (workerId: string, bookingStatus: string) => {
  const bookings = await Booking.find({
    worker: workerId,
    bookingStatus,
  }).populate({
    path: "service",
    select: "_id serviceName servicePhoto price reviews",
    populate: {
      path: "reviews",
      select: "rating",
    },
  });

  const results = bookings.map((booking) => {
    let service: any = booking.service;
    if (service && typeof service.toObject === "function") {
      service = service.toObject();
    }
    const reviews = service.reviews || [];
    const totalRating = reviews.reduce(
      (sum: number, r: any) => sum + (r.rating || 0),
      0
    );
    const avgRating = reviews.length ? totalRating / reviews.length : 0;

    // Remove reviews before returning
    const { reviews: _, ...serviceWithoutReviews } = service;

    return {
      ...booking.toObject(),
      service: {
        ...serviceWithoutReviews,
        avgRating,
      },
    };
  });

  return results;
};

const cancelBookingByUser = async (
  bookingId: string,
  data: Partial<TBooking>
) => {
  await Booking.findByIdAndUpdate(
    { _id: bookingId },
    {
      cancelReason: data.cancelReason,
      bookingStatus: "CancelByUser",
    },
    { new: true }
  );
  return;
};

const getBookingById = async (id: string) => {
  const result = await Booking.findOne({ _id: id });
  return result;
};

const updateBooking = async (id: string, data: Partial<TBooking>) => {
  await Booking.findOneAndUpdate({ _id: id }, data, { new: true });
  return;
};

const deleteBooking = async (id: string) => {
  await Booking.findOneAndDelete({ _id: id });
  return;
};

export const bookingServices = {
  createBooking,
  clientBookings,
  workerBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  cancelBookingByUser,
};
