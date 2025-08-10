import { Schema, model, Types } from "mongoose";
import { TQuestion, TOption } from "./question.interface";

const optionSchema = new Schema<TOption>(
  {
    _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
    text: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const questionSchema = new Schema<TQuestion>(
  {
    text: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: true,
    },
    options: {
      type: [optionSchema],
      validate: [
        {
          validator: (v: TOption[]) => v.length >= 2 && v.length <= 4,
          message: "A question must have between 2 and 4 options",
        },
        {
          validator: (v: TOption[]) => {
            const texts = v.map((o) => o.text.toLowerCase().trim());
            return new Set(texts).size === texts.length;
          },
          message: "Option texts must be unique",
        },
      ],
    },
    correctOptionId: {
      type: Schema.Types.ObjectId,
      required: true,
      validate: {
        validator: function (value: Types.ObjectId) {
          return this.options.some((opt) => opt._id?.equals(value));
        },
        message: "correctOptionId must match one of the provided options",
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

export const Question = model<TQuestion>("Question", questionSchema);
