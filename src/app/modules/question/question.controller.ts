import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Level } from "./question.interface";
import { questionService } from "./question.service";

const createQuestion = catchAsync(async (req, res) => {
  const question = await questionService.createQuestionIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Question created Successfully",
    data: question,
  });
});

const getQuestions = catchAsync(async (req, res) => {

  const questions = await questionService.getQuestionsFromDB(req.user.currentStep);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Questions retrived Successfully",
    data: questions,
  });
});
const quizResult = catchAsync(async (req, res) => {
  const questions = await questionService.evaluateQuiz(req.body.userAnswers,req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Result got Successfully",
    data: questions,
  });
});

export const questionController = {
  createQuestion,
  getQuestions,
  quizResult
};
