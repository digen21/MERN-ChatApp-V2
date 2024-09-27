import httpStatus from "http-status";

import { UserModel } from "../models";
import {
  FileType,
  FindByValues,
  FindUserInput,
  UpdateUserInput,
  Users,
} from "../types";
import { handleUploadImage, ServerError } from "../utils";

export default {
  create: async (createUserInput: Users) => {
    try {
      const user = await UserModel.create(createUserInput);
      await user.save();
      return user;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      console.error("Create User Error: ", error);

      throw new ServerError({
        message: "Failed to create user",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  findOne: async (where: FindUserInput) => {
    try {
      const user = await UserModel.findOne(where);
      return user;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      console.error("Find User Error: ", error);

      throw new ServerError({
        message: "Failed to find user",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  findByEmail: async (email: string) => {
    try {
      const user = await UserModel.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      });

      return user;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to find user by email",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  update: async (where: FindUserInput, updateInput: UpdateUserInput) => {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(where, updateInput, {
        new: true,
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to update profile",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  updateProfileImage: async (_id: string, file: Express.Multer.File) => {
    try {
      const avatarUrl = await handleUploadImage({
        file,
        fileType: FileType.PROFILE,
        time: Date.now(),
        id: _id,
      });

      const updatedProfileImage = UserModel.findOneAndUpdate(
        { _id },
        {
          avatar: avatarUrl,
        }
      );

      return updatedProfileImage;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to update profile image",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  findByIds: async (field: string, operator: string, ids: string[]) => {
    try {
      const users = await UserModel.find({ [field]: { [operator]: ids } });

      if (!users || users.length === 0) {
        throw new ServerError({
          message: "No users found",
          status: httpStatus.NOT_FOUND,
        });
      }

      return users;
    } catch (error) {
      throw new ServerError({
        message: "Failed to get users",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },
};
