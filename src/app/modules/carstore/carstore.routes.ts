import express from "express";
import { carstoreControllers } from "./carstore.controller";
import auth from "../../middleware/auth";
import { role } from "../user/user.model";
import { fileUploader } from "../../utils/fileUploader";
import { parseBodyData } from "../../middleware/parseBodyData";

const router = express.Router();

router.post(
  "/create",
  auth(role.admin),
  fileUploader.uploadMultiple,
  parseBodyData,
  carstoreControllers.createCarstore
);
router.get("/", carstoreControllers.getAllCarstores);
router.get("/:id", carstoreControllers.getCarstoreById);
router.patch("/:id", auth(), carstoreControllers.updateCarstore);
router.delete("/:id", auth(), carstoreControllers.deleteCarstore);

export const carstoreRoutes = router;
