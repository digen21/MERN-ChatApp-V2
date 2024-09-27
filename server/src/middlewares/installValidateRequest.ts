import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Schema } from "joi";

import { ServerError } from "../utils";

const validateInput =
  (schema: Schema) => async (req: Request, _: Response, next: NextFunction) => {
    const reqBody = {
      ...req.body,
      ...req.query,
      ...req.params,
    };

    const { error } = schema.validate(reqBody);

    if (error) {
      const simplifiedString = error?.details[0]?.message
        .replace(/"/g, "")
        .trim();

      return next(
        new ServerError({
          message: error?.details[0]?.message,
          status: httpStatus.BAD_REQUEST,
        })
      );
    }
    next();
  };

export default validateInput;
