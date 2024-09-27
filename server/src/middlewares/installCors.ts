import { Express } from "express";
import cors from "cors";

export default (app: Express) => {
  app.use(
    cors({
      origin: [String(process.env.CLIENT_URL)],
      methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
      credentials: true,
    })
  );
};
