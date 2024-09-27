import express from "express";

import { ChannelController } from "../controllers";
import { verifyToken } from "../middlewares";

const channelRouter = express.Router();

channelRouter.post("/", verifyToken, ChannelController.create);
channelRouter.get("/", verifyToken, ChannelController.get);
channelRouter.get(
  "/channel-messages",
  verifyToken,
  ChannelController.getChannelMessages
);

export default channelRouter;
