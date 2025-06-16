import Joi from "joi";
import { clientSchema } from "./client.schema";

export const userSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  clients: Joi.array().items(clientSchema),
});
