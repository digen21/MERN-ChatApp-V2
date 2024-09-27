import cookieParser from "cookie-parser";
import { Express } from "express";

export default (app: Express) => {
  app.use(cookieParser());
};
