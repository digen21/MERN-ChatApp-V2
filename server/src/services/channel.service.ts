import httpStatus from "http-status";

import mongoose from "mongoose";
import { UsersService } from ".";
import { ChannelModel } from "../models";
import { CreateChannelInput, UpdateChannelInput } from "../types";
import { ServerError } from "../utils";

export default {
  create: async (input: CreateChannelInput) => {
    try {
      const admin = await UsersService.findOne({ _id: input.userId });

      if (!admin) {
        throw new ServerError({
          message: "Admin user not found",
          status: httpStatus.NOT_FOUND,
        });
      }

      const validMembers = await UsersService.findByIds(
        "_id",
        "$in",
        input.members
      );

      if (validMembers.length !== input.members.length)
        throw new ServerError({
          message: "Some members are not valid users",
          status: httpStatus.NOT_FOUND,
        });

      const result = await ChannelModel.create({
        ...input,
        admin: input.userId,
      });
      await result.save();

      return { channel: result };
    } catch (error: any) {
      if (error?.errorResponse?.code === 11000) {
        throw new ServerError({
          message: "Channel already exists",
          status: httpStatus.CONFLICT,
        });
      }

      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to create channel",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  get: async (userId: string) => {
    try {
      const objectId = new mongoose.Types.ObjectId(userId);

      const channels = await ChannelModel.find({
        $or: [{ admin: objectId }, { members: objectId }],
      }).sort({ updatedAt: -1 });

      return channels;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to get channels",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  updateById: async (_id: string, updateChannelInput: UpdateChannelInput) => {
    try {
      const updateQuery = {
        $push: {
          messages: updateChannelInput.messages,
        },
      };

      // Update the channel document
      const updatedChannel = await ChannelModel.updateOne(
        { _id: new mongoose.Types.ObjectId(_id) }, // Use an object for the filter
        updateQuery,
        { new: true }
      );

      return updatedChannel;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to update channel",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  findById: async (id: string) => {
    try {
      const channel = await ChannelModel.findById(
        new mongoose.Types.ObjectId(id)
      ).populate("members");
      return channel;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to get channel",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  getChannelMessages: async (id: string) => {
    try {
      const channel = await ChannelModel.findById(
        new mongoose.Types.ObjectId(id)
      ).populate({
        path: "messages",
        populate: {
          path: "sender",
          select: "firstName lastName avatar color email",
        },
      });

      if (!channel)
        throw new ServerError({
          message: "Channel not found",
          status: httpStatus.NOT_FOUND,
        });

      return channel.messages;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to get channel messages",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },
};
