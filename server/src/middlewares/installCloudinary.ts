import { v2 as cloudinary } from "cloudinary";

const { CLOUDNIARY_API_SECRET, CLOUDNIARY_API_KEY, CLOUDNIARY_COULDNAME } =
  process.env;

export default () => {
  cloudinary.config({
    cloud_name: CLOUDNIARY_COULDNAME,
    api_key: CLOUDNIARY_API_KEY,
    api_secret: CLOUDNIARY_API_SECRET,
  });

  return cloudinary;
};
