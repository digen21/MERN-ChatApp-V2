import express from "express";

import { MessageController } from "../controllers";
import { upload, validateInput, verifyToken } from "../middlewares";
import { MessagesInput } from "../validators";

const messagesRouter = express.Router();

messagesRouter.get(
  "/",
  verifyToken,
  validateInput(MessagesInput),
  MessageController.messages
);

messagesRouter.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  MessageController.uploadFile
);

messagesRouter.get("/get-file", verifyToken, MessageController.getFile);

export default messagesRouter;
