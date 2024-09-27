import httpStatus from "http-status";
import { compare } from "bcrypt";

import { SingInInput, SingUpInput } from "../types";
import { generateJwtToken, ServerError } from "../utils";
import UsersService from "./users.service";

export default {
  singUp: async (input: SingUpInput) => {
    try {
      let user = await UsersService.findByEmail(input.email);

      if (user) {
        throw new ServerError({
          message: "Email already in use",
          status: httpStatus.CONFLICT,
        });
      }

      user = await UsersService.create(input);

      const accessToken = generateJwtToken({
        email: user.email,
        userId: String(user._id),
      });

      return {
        user,
        accessToken,
      };
    } catch (error) {
      if (error instanceof ServerError) throw error;

      console.error("SignUp Error: ", error);

      throw new ServerError({
        message: "Failed to signUp",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  singIn: async (input: SingInInput) => {
    try {
      let user = await UsersService.findByEmail(input.email);

      if (!user) {
        throw new ServerError({
          message: "User with this Email does not exists",
          status: httpStatus.NOT_FOUND,
        });
      }

      const isPasswordMatched = compare(input.password, user.password);

      if (!isPasswordMatched) {
        throw new ServerError({
          message: "Incorrect Password",
          status: httpStatus.NOT_FOUND,
        });
      }

      const accessToken = generateJwtToken({
        email: user.email,
        userId: String(user._id),
      });

      return {
        user,
        accessToken,
      };
    } catch (error) {
      if (error instanceof ServerError) throw error;

      console.error("SignUp Error: ", error);

      throw new ServerError({
        message: "Failed to signUp",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },
};
