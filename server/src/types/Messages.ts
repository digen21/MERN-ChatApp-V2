import { model, Schema, Types } from "mongoose";

export enum MessageType {
  FILE = "FILE",
  TEXT = "TEXT",
}

export interface Messages {
  _id?: Types.ObjectId | string;
  sender: Types.ObjectId | string;
  recipient?: Types.ObjectId | string | null;
  messageType: string;
  content?: string;
  fileUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FindMessagesBy {
  _id?: string;
  sender?: string;
  recipient?: string;
}

export interface GetMessagesInput {
  sender: string;
  recipient: string;
}
