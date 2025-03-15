import Joi from "joi";

export const createUserValidation = Joi.object({
  name: Joi.string().min(2).max(50).required()
});

export const getUserValidation = Joi.object({
  id: Joi.string().pattern(/^\d+$/).message('id must be a valid number').required(),
});