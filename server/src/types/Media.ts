export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  FILE = "file",
  TEXT = "text",
}

export enum FileType {
  PROFILE = "profile",
  MESSAGE = "message",
  OTHER = "other",
}

export interface GetFilePathInput {
  fileType: FileType;
  mediaType?: MediaType;
  id: string;
  time?: number;
}

export interface UploadImageInput extends GetFilePathInput {
  file: Express.Multer.File;
}

export interface UploadFileInput extends UploadImageInput {}

export interface UploadFile {
  file: Express.Multer.File;
  id: string;
}

export interface GetFile {
  userId: string;
  id: string;
}
