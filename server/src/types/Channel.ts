import { Types } from "mongoose";

export interface Channel extends Document {
  name: string;
  members: Types.ObjectId[];
  admin: Types.ObjectId;
  messages?: Types.ObjectId[] | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateChannelInput {
  name: string;
  userId: string;
  members: string[];
  messages?: string[];
}

export interface UpdateChannelInput {
  messages?: string[];
  members?: string[];
}
