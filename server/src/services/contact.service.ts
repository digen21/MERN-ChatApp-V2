import httpStatus from "http-status";

import { MessagesModel, UserModel } from "../models";
import { ServerError } from "../utils";
import mongoose from "mongoose";
interface SearchContactsInput {
  searchTerm: string;
  userId: string;
}

export default {
  searchContacts: async (input: SearchContactsInput) => {
    try {
      const sanitizedSearchTerm = input.searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(sanitizedSearchTerm, "i");

      const contacts = await UserModel.find({
        $and: [{ _id: { $ne: input.userId } }],
        $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
      });

      return contacts;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to search contacts",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  contacts: async (userId: string) => {
    try {
      const contacts = await MessagesModel.aggregate([
        // Filter messages where the user is either the sender or recipient
        {
          $match: {
            $or: [
              {
                recipient: new mongoose.Types.ObjectId(userId),
              },
              {
                sender: new mongoose.Types.ObjectId(userId),
              },
            ],
          },
        },
        {
          $sort: {
            // Sort the results by last message time in descending order
            lastMessageTime: -1,
          },
        },
        {
          // Group messages by the other user's ID (either sender or recipient)
          $group: {
            _id: {
              $cond: [
                { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
                "$recipient",
                "$sender",
              ],
            },
            lastMessageTime: { $first: "$createdAt" },
          },
        },
        {
          // Lookup the user's information from the "users" collection
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "contactInfo",
          },
        },
        {
          // Unwind the contactInfo array to a single object
          $unwind: "$contactInfo",
        },
        {
          // Project the desired fields
          $project: {
            _id: 1,
            lastMessage: 1,
            email: "$contactInfo.email",
            firstName: "$contactInfo.firstName",
            lastName: "$contactInfo.lastName",
            avatar: "$contactInfo.avatar",
            color: "$contactInfo.color",
          },
        },
        {
          $sort: {
            // Sort the results by last message time in descending order
            lastMessageTime: -1,
          },
        },
      ]);

      return contacts;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to get contacts",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },

  getAllContacts: async (id: string) => {
    try {
      const users = await UserModel.find(
        { _id: { $ne: id } },
        "firstName lastName _id"
      );

      const contacts = users.map((user) => ({
        label: user?.firstName
          ? `${user.firstName} ${user.lastName}`
          : user.email,
        value: user?.id,
      }));

      return contacts;
    } catch (error) {
      if (error instanceof ServerError) throw error;

      throw new ServerError({
        message: "Failed to get users",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  },
};
