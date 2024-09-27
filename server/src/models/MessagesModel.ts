import { model, Schema } from "mongoose";

import { Messages, MessageType } from "../types";

const MessagesSchema = new Schema<Messages>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },

    //recipient id is not required, as use can send message to him self too.
    //And also for the channels (multiple members in channels)
    recipient: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "users",
    },

    messageType: {
      type: String,
      enum: MessageType,
      required: true,
    },

    content: {
      type: String,
      validate: {
        validator: function (this: any) {
          // Require content if messageType is TEXT
          return this.messageType === MessageType.TEXT ? !!this.content : true;
        },
        message: "Content is required for text messages.",
      },
    },

    fileUrl: {
      type: String,
      validate: {
        validator: function (this: any) {
          // Require fileUrl if messageType is FILE
          return this.messageType === MessageType.FILE ? !!this.fileUrl : true;
        },
        message: "File URL is required for file messages.",
      },
    },
  },
  { timestamps: true }
);

MessagesSchema.pre(
  ["updateOne", "findOneAndUpdate", "save"],
  function (next: any) {
    this.set({ updatedAt: Date.now() });
    next();
  }
);

export default model<Messages>("messages", MessagesSchema);
