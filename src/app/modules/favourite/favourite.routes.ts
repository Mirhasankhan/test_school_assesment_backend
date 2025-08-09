import express from "express";
import { favouriteControllers } from "./favourite.controller";
import auth from "../../middleware/auth";
import { role } from "../user/user.model";

const router = express.Router();

router.post(
  "/create/:id",
  auth(role.user),
  favouriteControllers.createFavourite
);
router.get("/", auth(role.user), favouriteControllers.myFavourites);
router.get("/:id", auth(role.user), favouriteControllers.getFavouriteById);
router.patch("/:id", auth(role.user), favouriteControllers.updateFavourite);
router.delete("/:id", auth(role.user), favouriteControllers.deleteFavourite);

export const favouriteRoutes = router;
