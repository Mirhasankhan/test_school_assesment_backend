import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { userRoute } from "../modules/user/user.route";
import { questionRoutes } from "../modules/question/question.route";

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
    path: "/question",
    route: questionRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
