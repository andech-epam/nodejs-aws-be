import * as Joi from 'joi';

export const productValidationSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().uuid(),
  title: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(3).max(200).required(),
  price: Joi.number().min(0).max(99999999).required(),
  image: Joi.string().min(1).max(9999).uri(),
  count: Joi.number().min(0).max(99999999).required(),
});
