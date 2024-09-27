import { NextFunction, Request, Response } from "express";
import { ServerError } from "../utils";
import httpStatus from "http-status";
import { MessagesService } from "../services";

export default {
  messages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req as any;
      const { recipient } = req?.query;

      const response = await MessagesService.messages({
        sender: userId,
        recipient: String(recipient),
      });

      return res.status(httpStatus.OK).send({
        messages: response,
        status: httpStatus.OK,
      });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      throw new ServerError({
        message: "Failed fetch messages",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  uploadFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req as any;

      const response = await MessagesService.uploadFile({
        file: req.file as Express.Multer.File,
        id: userId as string,
      });

      return res.status(httpStatus.OK).send({
        fileUrl: response,
        status: httpStatus.OK,
      });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      throw new ServerError({
        message: "Failed fetch messages",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  getFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req as any;
      const { id } = req.query;

      const response = await MessagesService.getFile({
        id: String(id),
        userId,
      });

      return res.status(httpStatus.OK).send({
        fileUrl: response,
        status: httpStatus.OK,
      });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      throw new ServerError({
        message: "Failed get file",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },
};
