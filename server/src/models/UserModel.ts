import { model, Schema } from "mongoose";

import { Users } from "../types";
import { genSalt, hash } from "bcrypt";

const UsersSchema = new Schema<Users>(
  {
    email: {
      type: "string",
      required: [true, "Email is required"],
      unique: true,
    },

    password: {
      type: "string",
      required: [true, "Password is required"],
    },

    firstName: {
      type: "string",
      default: null,
    },

    lastName: {
      type: "string",
      default: null,
    },

    avatar: {
      type: "string",
      default: null,
    },

    color: {
      type: "number",
      default: null,
    },

    isProfileSetup: {
      type: "boolean",
      default: false,
    },
  },
  { timestamps: true }
);

UsersSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

UsersSchema.pre(
  ["updateOne", "findOneAndUpdate", "save"],
  function (next: any) {
    this.set({ updatedAt: Date.now() });
    next();
  }
);

export default model<Users>("users", UsersSchema);
