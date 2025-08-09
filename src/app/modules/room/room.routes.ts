import express from 'express';
import { roomControllers } from "./room.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post('/', auth(), roomControllers.createRoom);
router.get('/', auth(), roomControllers.getAllRooms);
router.get('/:id', auth(), roomControllers.getRoomById);
router.patch('/:id', auth(), roomControllers.updateRoom);
router.delete('/:id', auth(), roomControllers.deleteRoom);

export const roomRoutes = router;
