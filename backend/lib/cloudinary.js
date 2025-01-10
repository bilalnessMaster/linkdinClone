import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
const {
  CLOUDINARY_CLOUD_NAME: name,
  CLOUDINARY_API_KEY: key,
  CLOUDINARY_API_SECRET: api,
} = process.env;

cloudinary.config({
  cloud_name: name,
  api_key: key,
  api_secret: api,
});

export const uploadMedia = async (file , folder) => {
  try {
    const response = await cloudinary.uploader.upload(file, {
      folder : folder ,
      resource_type: "auto",
    });
    return response
  } catch (error) {
    console.log("error while uploading to cloudinary " + error);
  }
};

export const deleteMedia = async (publicId) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    return response
  } catch (error) {
    console.log("error while deleting  from cloudinary " + error);
  }
};
