import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { ServerError } from "../utils";

const installErrorhandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (process.env.NODE_ENV !== "production") {
  }

  if (err instanceof ServerError) {
    return res
      .status(Number(err.statusCode))
      .send({ message: err.message, statusCode: err.statusCode });
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: "Internal Server Error",
  });
};

export default installErrorhandler;
