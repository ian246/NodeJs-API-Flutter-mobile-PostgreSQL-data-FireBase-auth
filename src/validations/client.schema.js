import Joi from "joi";

export const clientSchema = Joi.object({
  id: Joi.number().integer().optional(), // <-- obrigatório ser .optional()
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  user_id: Joi.string().optional(),
});
