import Joi from "joi";

export const createBookValidation = Joi.object({
  name: Joi.string().min(2).max(50).required()
});

export const getBookValidation = Joi.object({
  id: Joi.string().pattern(/^\d+$/).message('id must be a valid number').required(),
});