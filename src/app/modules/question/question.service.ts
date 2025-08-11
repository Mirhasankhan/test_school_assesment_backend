import AppError from "../../utils/AppError";
import { Question } from "./question.model";
import { CreateQuestionPayload } from "./question.interface";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { jwtHelpers } from "../../utils/jwtHelpers";
import config from "../../config";

const createQuestionIntoDB = async (payload: CreateQuestionPayload) => {
  const existingQuestion = await Question.findOne({
    text: payload.text.trim(),
  }).collation({ locale: "en", strength: 2 });

  if (existingQuestion) {
    throw new AppError(409, "This question already exists!");
  }

  const count = await Question.countDocuments({ level: payload.level });
  if (count >= 22) {
    throw new AppError(
      400,
      `Cannot add more than 22 questions for level ${payload.level}`
    );
  }

  const optionTexts = payload.options.map((option) =>
    option.text.toLowerCase().trim()
  );
  if (new Set(optionTexts).size !== optionTexts.length) {
    throw new AppError(400, "Option texts must be unique");
  }

  if (payload.options.length < 2 || payload.options.length > 4) {
    throw new AppError(400, "A question must have between 2 and 4 options");
  }

  const optionsWithId = payload.options.map((opt) => ({
    _id: new Types.ObjectId(),
    text: opt.text.trim(),
  }));

  if (
    payload.correctOptionIndex < 0 ||
    payload.correctOptionIndex >= optionsWithId.length
  ) {
    throw new AppError(400, "Invalid correctOptionIndex");
  }

  const correctOptionId = optionsWithId[payload.correctOptionIndex]._id;

  const question = await Question.create({
    text: payload.text.trim(),
    level: payload.level,
    options: optionsWithId,
    correctOptionId,
  });

  return question;
};

const getQuestionsFromDB = async (levelNumber: 1 | 2 | 3) => {
  const prefixMap: Record<number, string> = {
    1: "A",
    2: "B",
    3: "C",
  };

  const prefix = prefixMap[levelNumber];
  if (!prefix) throw new Error("Invalid level number");

  const levelsToFind = [`${prefix}1`, `${prefix}2`];

  const questions = await Question.find({
    level: { $in: levelsToFind },
  }).lean();

  return questions;
};

const evaluateQuiz = async (userAnswers: any, userId: string) => {
  const currentUser = await User.findById(userId).lean();
  if (!currentUser) throw new Error("User not found");

  const questionIds = userAnswers.map((a: any) => a.questionId);
  const questions = await Question.find({
    _id: { $in: questionIds.map((id: any) => new Types.ObjectId(id)) },
  })
    .select("_id text correctOptionId options")
    .lean();

  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

  let correctCount = 0;
  const details = [];

  for (const answer of userAnswers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;

    const correctOptionId = question.correctOptionId.toString();
    const isCorrect = correctOptionId === answer.selectedOptionId;

    if (isCorrect) correctCount++;

    const selectedOption = question.options.find(
      (opt: any) => opt._id.toString() === answer.selectedOptionId
    );

    details.push({
      questionId: answer.questionId,
      questionText: question.text,
      selectedOptionId: answer.selectedOptionId,
      selectedOptionText: selectedOption ? selectedOption.text : null,
      correctOptionId,
      correct: isCorrect,
    });
  }

  const totalQuestions = userAnswers.length;
  const percentage =
    totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

  let updatedLevel: string | "blocked" = "";
  const updateData: any = {};

  if (currentUser.currentStep === 1) {
    if (percentage < 25) {
      updateData.isBlocked = true;
      updatedLevel = "blocked";
    } else if (percentage < 50) {
      updateData.currentLevel = "A1";
      updatedLevel = "A1";
      updateData.isBlocked = false;
      updateData.currentStep = 1;
    } else if (percentage < 75) {
      updateData.currentLevel = "A2";
      updatedLevel = "A2";
      updateData.isBlocked = false;
      updateData.currentStep = 1;
    } else {
      updateData.currentLevel = "A2";
      updatedLevel = "A2";
      updateData.isBlocked = false;
      updateData.currentStep = 2;
    }
  } else if (currentUser.currentStep === 2) {
    if (percentage < 25) {
      updateData.currentLevel = "A2";
      updatedLevel = "A2";
      updateData.isBlocked = false;
      updateData.currentStep = 2;
    } else if (percentage < 50) {
      updateData.currentLevel = "B1";
      updatedLevel = "B1";
      updateData.isBlocked = false;
      updateData.currentStep = 2;
    } else if (percentage < 75) {
      updateData.currentLevel = "B2";
      updatedLevel = "B2";
      updateData.isBlocked = false;
      updateData.currentStep = 2;
    } else {
      updateData.currentLevel = "B2";
      updatedLevel = "B2";
      updateData.isBlocked = false;
      updateData.currentStep = 3;
    }
  } else if (currentUser.currentStep === 3) {
    if (percentage < 25) {
      updateData.currentLevel = "B2";
      updatedLevel = "B2";
      updateData.isBlocked = false;
      updateData.currentStep = 3;
    } else if (percentage < 50) {
      updateData.currentLevel = "C1";
      updatedLevel = "C1";
      updateData.isBlocked = false;
      updateData.currentStep = 3;
    } else {
      updateData.currentLevel = "C2";
      updatedLevel = "C2";
      updateData.isBlocked = false;
      updateData.currentStep = 3;
    }
  }

  await User.updateOne({ _id: userId }, { $set: updateData });

  const updatedToken = jwtHelpers.generateToken(
    {
      id: userId,
      email: currentUser.email,
      role: currentUser.role,
      currentLevel: updateData.currentLevel,
      currentStep: updateData.currentStep,
      isBlocked: updateData.isBlocked,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return {
    totalQuestions,
    correctAnswers: correctCount,
    percentage: Number(percentage.toFixed(2)),
    details,
    updatedLevel,
    accessToken: updatedToken,
  };
};

export const questionService = {
  createQuestionIntoDB,
  getQuestionsFromDB,
  evaluateQuiz,
};
