import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import { ServerError } from "../utils";

export interface ExtendedRequest extends Request {
  userId: string | null;
}

const verifyToken = (req: any, _: Response, next: NextFunction) => {
  const token = req.cookies?.jwt;

  if (!token)
    return next(
      new ServerError({
        message: "Unauthorized",
        status: httpStatus.UNAUTHORIZED,
      })
    );

  jwt.verify(
    token,
    String(process.env.JWT_SECRET),
    async (error: any, payload: any) => {
      if (error)
        return next(
          new ServerError({
            message: "Invalid token",
            status: httpStatus.FORBIDDEN,
          })
        );

      req.userId = payload.userId;
      next();
    }
  );
};

export default verifyToken;
