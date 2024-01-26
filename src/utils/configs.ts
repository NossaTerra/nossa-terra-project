import { v2 as cloudinaryV2, type ConfigOptions } from "cloudinary";
import { env } from "~/env";

cloudinaryV2.config({
  cloud_name: `${env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${env.CLOUDINARY_API_KEY}`,
  api_secret: `${env.CLOUDINARY_API_SECRET}`,
} as ConfigOptions);

export default cloudinaryV2;
