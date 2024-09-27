import httpStatus from "http-status";
import { installCloudinary } from "../middlewares";

import {
  FileType,
  GetFilePathInput,
  MediaType,
  UploadImageInput,
} from "../types";
import ServerError from "./ServerError";

const imageRegex = /^image\/(jpeg|jpg|png|gif|bmp|webp|tiff|svg\+xml)$/;
const videoRegex = /^video\/(mp4|webm|ogg)$/;
const audioRegex = /^audio\/(mpeg|wav|ogg)$/;
const fileRegex = /^application\/(pdf|zip|msword|vnd\.ms-excel)$/; // Example for file types

export const getMediaType = (mimeType: string): string => {
  if (imageRegex.test(mimeType)) {
    return MediaType.IMAGE;
  } else if (videoRegex.test(mimeType)) {
    return MediaType.VIDEO;
  } else if (audioRegex.test(mimeType)) {
    return MediaType.AUDIO;
  } else if (fileRegex.test(mimeType)) {
    return MediaType.FILE;
  } else {
    throw new ServerError({
      message: "Invalid media type",
      status: httpStatus.BAD_REQUEST,
    });
  }
};

const mediaTypePaths: Record<MediaType, string> = {
  [MediaType.IMAGE]: "image",
  [MediaType.AUDIO]: "audio",
  [MediaType.VIDEO]: "video",
  [MediaType.FILE]: "file",
  [MediaType.TEXT]: "text",
};

export const constructFilePath = (
  mediaType: MediaType,
  fileType: string,
  id: string,
  time: number
): string => {
  const defaultFolder = "Chat-App-V2";

  if (!mediaTypePaths[mediaType]) {
    throw new Error(`Unsupported message type: ${mediaType}`);
  }
  return `${defaultFolder}/${fileType}/${mediaTypePaths[mediaType]}/${id}.${time}`;
};

const getFilePath = ({ fileType, id, time, mediaType }: GetFilePathInput) => {
  const defaultFolder = "Chat-App-V2";

  if (fileType === FileType.MESSAGE && !!mediaType) {
    return constructFilePath(mediaType, fileType, id, time as number);
  }

  if (fileType === FileType.OTHER) {
    return `${defaultFolder}/${fileType}/${id}.${time}`;
  }

  if (fileType === FileType.PROFILE) {
    return `${defaultFolder}/${fileType}/${id}`;
  }
};

export default async (input: UploadImageInput) => {
  const cloudinary = installCloudinary();

  const b64 = Buffer.from(input.file.buffer).toString("base64");
  let dataURI = "data:" + input.file.mimetype + ";base64," + b64;

  const filePath = getFilePath({
    fileType: input.fileType,
    id: input.id,
    time: input?.time,
    mediaType: input?.mediaType,
  });

  const res = await cloudinary.uploader.upload(dataURI, {
    public_id: filePath,
  });

  return res.url;
};
