import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { ChannelService } from "../services";
import { CreateChannelInput } from "../types";
import { ServerError } from "../utils";

export default {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req as any;

      const body = {
        ...req.body,
        userId,
      } as CreateChannelInput;

      const response = await ChannelService.create(body);

      return res
        .status(httpStatus.CREATED)
        .send({ ...response, status: httpStatus.CREATED });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      return next(
        new ServerError({
          message: "Failed create channel",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        })
      );
    }
  },

  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req as any;
      const response = await ChannelService.get(String(userId));

      return res
        .status(httpStatus.OK)
        .send({ channels: response, status: httpStatus.OK });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      return next(
        new ServerError({
          message: "Failed create channel",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        })
      );
    }
  },

  getChannelMessages: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.query as any;
      const response = await ChannelService.getChannelMessages(String(id));

      return res
        .status(httpStatus.OK)
        .send({ messages: response, status: httpStatus.OK });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      return next(
        new ServerError({
          message: "Failed create channel",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        })
      );
    }
  },
};
