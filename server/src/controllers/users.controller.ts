import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { UsersService } from "../services";
import { ServerError } from "../utils";

export default {
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req as any;
      const response = await UsersService.update(
        { _id: userId },
        { ...req.body, file: req.file, isProfileSetup: true }
      );

      return res
        .status(httpStatus.OK)
        .send({ user: response, status: httpStatus.OK });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      return next(
        new ServerError({
          message: "Failed to sing up",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        })
      );
    }
  },

  updateProfileImage: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req as any;
      const file = req.file as Express.Multer.File;

      if (!file) {
        throw new ServerError({
          message: "Image is required",
          status: httpStatus.BAD_GATEWAY,
        });
      }

      const response = await UsersService.updateProfileImage(userId, file);

      return res
        .status(httpStatus.OK)
        .send({ user: response, status: httpStatus.OK });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      return next(
        new ServerError({
          message: "Failed to update profile image",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        })
      );
    }
  },
};
