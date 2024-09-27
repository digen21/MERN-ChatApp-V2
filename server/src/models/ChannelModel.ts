import { model, Schema } from "mongoose";
import { Channel } from "../types";

const ChannelSchema = new Schema<Channel>(
  {
    name: {
      type: "string",
      required: [true, "Channel name is required"],
      unique: true,
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: [true, "Channel members are required"],
      },
    ],

    admin: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "messages",
        default: null,
      },
    ],
  },
  { timestamps: true }
);

ChannelSchema.pre(
  ["updateOne", "findOneAndUpdate", "save"],
  function (next: any) {
    this.set({ updatedAt: Date.now() });
    next();
  }
);

export default model<Channel>("channels", ChannelSchema);
