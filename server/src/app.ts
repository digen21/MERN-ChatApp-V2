import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { Server } from "http";

import {
  installCookieParser,
  installCors,
  installErrorhandler,
  installMongodb,
} from "./middlewares";
import useRouter from "./routes";
import setUpSocket from "./socket";

const makeApp = () => {
  const app = express();

  const { PORT, SERVER_URL } = process.env;

  installMongodb();
  installCors(app);
  installCookieParser(app);

  app.use(express.json());

  useRouter(app);

  app.use(installErrorhandler);

  app.get("/health", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send({
      message: "Good",
      status: 200,
    });
  });

  const server = app.listen(Number(PORT), () =>
    console.log(`🚀 ~ Server listening on ${SERVER_URL}`)
  );

  setUpSocket(server);
};

export default makeApp;
