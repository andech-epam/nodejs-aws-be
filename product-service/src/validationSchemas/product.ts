import * as Joi from "joi";

export const productValidationSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(3).max(200).required(),
  price: Joi.number().min(0).required(),
  image: Joi.string().uri(),
  count: Joi.number().min(0).required(),
});
