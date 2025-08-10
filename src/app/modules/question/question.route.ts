import Express from "express";
import { questionController } from "./question.controller";
import auth from "../../middleware/auth";

const router = Express.Router();

router.post("/create", questionController.createQuestion);
router.get("/", auth(), questionController.getQuestions);
router.post("/quiz", auth(), questionController.quizResult);

export const questionRoutes = router;
