import Joi from "joi";

export const clientSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  user_id: Joi.string().required(),
  location: Joi.string().required(),
  data: Joi.object().required(),
});
