import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { userRoute } from "../modules/user/user.route";
import { slotRoute } from "../modules/slots/slots.route";
import { serviceRoutes } from "../modules/service/service.routes";
import { categoryRoutes } from "../modules/category/category.routes";
import { bookingRoutes } from "../modules/booking/booking.routes";
import { reviewRoutes } from "../modules/review/review.routes";
import { revenueRoutes } from "../modules/revenue/revenue.routes";
import { carstoreRoutes } from "../modules/carstore/carstore.routes";
import { carbookRoutes } from "../modules/carbook/carbook.routes";
import { favouriteRoutes } from "../modules/favourite/favourite.routes";
import { messageRoutes } from "../modules/message/message.routes";

const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/slot",
    route: slotRoute,
  },
  {
    path: "/service",
    route: serviceRoutes,
  },
  {
    path: "/category",
    route: categoryRoutes,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
  {
    path: "/review",
    route: reviewRoutes,
  },
  {
    path: "/revenue",
    route: revenueRoutes,
  },
  {
    path: "/carstore",
    route: carstoreRoutes,
  },
  {
    path: "/carbook",
    route: carbookRoutes,
  },
  {
    path: "/favourite",
    route: favouriteRoutes,
  },
  {
    path: "/message",
    route: messageRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
