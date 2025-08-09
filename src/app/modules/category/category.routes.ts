import express from 'express';
import { categoryControllers } from "./category.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post('/create', auth(), categoryControllers.createCategory);
router.get('/', categoryControllers.getAllCategorys);
router.get('/:id', auth(), categoryControllers.getCategoryById);
router.patch('/:id', auth(), categoryControllers.updateCategory);
router.delete('/:id', auth(), categoryControllers.deleteCategory);

export const categoryRoutes = router;
