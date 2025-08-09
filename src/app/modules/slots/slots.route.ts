import Express from "express";
import { slotController } from "./slots.controller";
import auth from "../../middleware/auth";
import { role } from "../user/user.model";

const router = Express.Router();

router.post("/create", auth(role.pro), slotController.createSlots);
router.patch("/update/:slotId", auth(role.pro), slotController.updateSlot);
router.get("/my-slots", auth(role.pro), slotController.mySlots);

export const slotRoute = router;
