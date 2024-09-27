import Joi from "joi";
import { GetMessagesInput, Messages } from "../types";

export const SendMessagesInput = Joi.object<Messages>({
  sender: Joi.string().required().messages({
    "string.empty": "Sender is required",
  }),
  recipient: Joi.string().optional(),
  content: Joi.string().optional(),
  messageType: Joi.string().required().messages({
    "string.empty": "Message type is required",
  }),
});

export const MessagesInput = Joi.object<GetMessagesInput>({
  recipient: Joi.string().required().messages({
    "string.empty": "Receiver is required",
  }),
});
