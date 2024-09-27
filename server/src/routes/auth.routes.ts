import express from "express";

import { AuthController } from "../controllers";
import { validateInput, verifyToken } from "../middlewares";
import { ValidateSignInInput, ValidateSignUpInput } from "../validators";

const authRouter = express.Router();

authRouter.post(
  "/signUp",
  validateInput(ValidateSignUpInput),
  AuthController.signUp
);

authRouter.post(
  "/signIn",
  validateInput(ValidateSignInInput),
  AuthController.signIn
);

authRouter.post("/logout", AuthController.logout);

authRouter.get("/profile", verifyToken, AuthController.profile);

export default authRouter;
