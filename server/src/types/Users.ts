import { Types } from "mongoose";

export interface Users {
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  color?: number | null;
  isProfileSetup?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SingUpInput {
  email: string;
  password: string;
}

export interface SingInInput extends SingUpInput {}

export interface GenerateTokenInput {
  email: string;
  userId: string;
}

export interface FindUserInput {
  email?: string;
  _id?: string;
}

export interface UpdateUserInput {
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  color?: number;
  isProfileSetup?: boolean;
  file?: Express.Multer.File;
}

export interface FindByValues {
  _id?: string[];
  email?: string[];
}
