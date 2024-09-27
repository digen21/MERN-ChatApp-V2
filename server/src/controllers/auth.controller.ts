import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { AuthService, UsersService } from "../services";
import { maxAge, ServerError } from "../utils";

export default {
  signUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await AuthService.singUp(req.body);

      res.cookie("jwt", response.accessToken, {
        maxAge: maxAge,
        secure: true,
        sameSite: "none",
      });

      return res
        .status(httpStatus.CREATED)
        .send({ ...response, status: httpStatus.CREATED });
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

  signIn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await AuthService.singIn(req.body);

      res.cookie("jwt", response.accessToken, {
        maxAge: maxAge,
        secure: true,
        sameSite: "none",
      });

      return res
        .status(httpStatus.OK)
        .send({ ...response, status: httpStatus.OK });
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

  profile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req as any;
      const user = await UsersService.findOne({ _id: userId });

      return res.status(httpStatus.OK).send({ user, status: httpStatus.OK });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      return next(
        new ServerError({
          message: "Failed to get profile",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        })
      );
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "none" });

      return res.status(httpStatus.OK).send({
        message: "Logged Out...",
        status: httpStatus.OK,
      });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      return next(
        new ServerError({
          message: "Failed to logout",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        })
      );
    }
  },
};
