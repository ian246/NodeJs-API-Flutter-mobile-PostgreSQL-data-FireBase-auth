import Joi from "joi";
import { clientSchema } from "./client.schema.js";

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  clients: Joi.array().items(clientSchema).optional(),
});




