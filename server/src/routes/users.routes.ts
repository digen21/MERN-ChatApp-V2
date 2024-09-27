import express from "express";

import { UserController } from "../controllers";
import { upload, validateInput, verifyToken } from "../middlewares";
import { updateUserProfile } from "../validators";

const userRouter = express.Router();

userRouter.put(
  "/",
  validateInput(updateUserProfile),
  verifyToken,
  UserController.update
);

userRouter.put(
  "/profile-image",
  verifyToken,
  upload.single("profile-image"),
  UserController.updateProfileImage
);

export default userRouter;
