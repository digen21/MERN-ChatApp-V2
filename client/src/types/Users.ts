export interface Users {
  _id: string;
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  color?: number | null;
  isProfileSetup?: boolean;
}

export interface SingUpInput {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface SingInInput {
  email: string;
  password: string;
}

export interface GenerateTokenInput {
  email: string;
  userId: string;
}

export interface FindUserInput {
  email?: string;
  userId?: string;
}

export interface User {
  _id?: string;
  email?: string;
  password?: string;
  firstName?: null;
  lastName?: null;
  avatar?: null;
  color?: null;
  isProfileSetup: boolean;
}

export interface SingInPayload {
  user?: User;
  accessToken?: string;
  status?: number;
}

export interface SingUpPayload extends SingInPayload {}

export interface AuthState {
  userInfo: User | null;
  setUserInfo: (userInfo: any) => void;
}

export interface UpdateUserInput {
  firstName: string;
  lastName: string;
  avatar?: object;
  color: number;
}

export interface CreateChannelInput {
  name: string;
  members: string[];
  messages?: string[];
}

export interface Channel {
  _id: string;
  name: string;
  members: string[];
  admin: string;
  message?: string[] | [];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateChannelPayload {
  channel: Channel;
  status: number;
}

export interface Channel extends User {
  name: string;
  members: string[];
  admin: string;
}

export interface Messages {
  _id: string;
  sender: string;
  recipient?: string;
  channelId?: string;
  messageType: string;
  fileUrl?: string | undefined;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SendMessage {
  sender: string;
  recipient?: string;
  channelId?: string;
  messageType: string;
  fileUrl?: string | undefined;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SendChannelMessage {
  sender: string;
  recipient?: string;
  channelId?: string;
  messageType: string;
  fileUrl?: string | undefined;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChannelMessages {
  _id: string;
  sender: Users;
  recipient: null;
  messageType: string;
  content: string;
  fileUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageInfo {
  message: Messages;
  channelMessage: ChannelMessages;
}

export enum ChatType {
  CONTACT = "contact",
  CHANNEL = "channel",
  TEXT = "TEXT",
  FILE = "FILE",
}

export interface ChannelMessage {
  _id: string;
  sender: User;
  recipient?: null;
  messageType: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
