import express from "express";
import { messageControllers } from "./message.controller";
import auth from "../../middleware/auth";
import { fileUploader } from "../../utils/fileUploader";

const router = express.Router();

router.post("/", auth(), messageControllers.createMessage);
router.post(
  "/generate-url",
  fileUploader.uploadMultiple,
  messageControllers.generateFileUrl
);
router.get("/", auth(), messageControllers.getAllMessages);
router.get("/:id", auth(), messageControllers.getMessageById);
router.patch("/:id", auth(), messageControllers.updateMessage);
router.delete("/:id", auth(), messageControllers.deleteMessage);

export const messageRoutes = router;
