import { Express } from "express";

import authRouter from "./auth.routes";
import contactsRouter from "./contacts.routes";
import messagesRouter from "./messages.routes";
import userRouter from "./users.routes";
import channelRouter from "./channel.routes";

const useRouter = (app: Express) => {
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/contacts", contactsRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api/channels", channelRouter);
};

export default useRouter;
