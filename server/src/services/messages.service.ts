import httpStatus from "http-status";
import { startSession } from "mongoose";

import { MessagesModel } from "../models";
import {
  FileType,
  FindMessagesBy,
  GetFile,
  GetMessagesInput,
  MediaType,
  Messages,
  UploadFile,
  UploadFileInput,
} from "../types";
import { handleUploadImage, ServerError } from "../utils";

export default {
  create: async (createMessageInput: Messages): Promise<Messages | null> => {
    const session = await startSession();
    session.startTransaction();

    try {
      const message = await MessagesModel.create(createMessageInput);
      await message.save();

      await session.commitTransaction();
      return message;
    } catch (error) {
      await session.abortTransaction();

      if (error instanceof ServerError) throw error;

      console.error("Create Message Error: ", error);

      throw new ServerError({
        message: "Failed to save message",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await session.endSession();
    }
  },

  get: async (where: FindMessagesBy) => {
    try {
      const result = await MessagesModel.find(where)
        .populate("sender", "id email firstName lastName avatar color")
        .populate("recipient", "id email firstName lastName avatar color");

      return result;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to get message",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  messages: async (input: GetMessagesInput) => {
    const { recipient, sender } = input;

    const find = [
      { sender, recipient },
      { sender: recipient, recipient: input.sender },
    ];

    try {
      const messages = await MessagesModel.find({
        $or: find,
      }).sort({ createdAt: 1 });

      return messages;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to search contacts",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  uploadFile: async (input: UploadFile) => {
    try {
      const fileUrl = await handleUploadImage({
        file: input.file,
        id: input.id,
        fileType: FileType.MESSAGE,
        time: Date.now(),
      });

      return fileUrl;
    } catch (error) {
      throw new ServerError({
        message: "Failed to upload file",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  getFile: async (input: GetFile) => {
    const { id, userId } = input;
    try {
      const message = await MessagesModel.findOne({
        $or: [
          { _id: id, sender: userId },
          { _id: id, recipient: userId },
        ],
      });

      return message?.fileUrl;
    } catch (error) {
      throw new ServerError({
        message: "Failed to get file",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },
};
