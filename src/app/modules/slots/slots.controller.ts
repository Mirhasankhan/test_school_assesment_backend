import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { slotService } from "./slots.service";

const createSlots = catchAsync(async (req, res) => {
  await slotService.createSlots(req.body.data, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Slots created successfull",
  });
});

const updateSlot = catchAsync(async (req, res) => {
  await slotService.updateSlot(req.params.slotId, req.user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Slots updated successfull",
  });
});

const mySlots = catchAsync(async (req, res) => {
  const slots = await slotService.mySlots(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Slots retrived successfully",
    data: slots,
  });
});

export const slotController = {
  createSlots,
  updateSlot,
  mySlots,
};
