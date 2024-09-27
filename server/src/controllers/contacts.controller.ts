import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { ContactService } from "../services";
import { ServerError } from "../utils";

export default {
  searchContacts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req as any;
      const { searchTerms } = req?.query;

      const response = await ContactService.searchContacts({
        userId,
        searchTerm: String(searchTerms),
      });

      return res
        .status(httpStatus.OK)
        .send({ contacts: response, status: httpStatus.OK });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      return next(
        new ServerError({
          message: "Failed to get contacts",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        })
      );
    }
  },

  contacts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req as any;

      const response = await ContactService.contacts(userId);

      return res
        .status(httpStatus.OK)
        .send({ contacts: response, status: httpStatus.OK });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      return next(
        new ServerError({
          message: "Failed to get contacts",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        })
      );
    }
  },

  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req as any;
      const response = await ContactService.getAllContacts(userId);

      return res
        .status(httpStatus.OK)
        .send({ contacts: response, status: httpStatus.OK });
    } catch (error) {
      if (error instanceof ServerError) return next(error);

      return next(
        new ServerError({
          message: "Failed to get all users",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        })
      );
    }
  },
};
