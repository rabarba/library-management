import Joi from "joi";

export const borrowBookValidation = Joi.object({
  userId: Joi.string().pattern(/^\d+$/).message('userId must be a valid number').required(),
  bookId: Joi.string().pattern(/^\d+$/).message('bookId must be a valid number').required(),
});

export const returnBookValidation = Joi.object({
  userId: Joi.string().pattern(/^\d+$/).message('userId must be a valid number').required(),
  bookId: Joi.string().pattern(/^\d+$/).message('bookId must be a valid number').required(),
  score: Joi.number().required().min(1).max(10)
});