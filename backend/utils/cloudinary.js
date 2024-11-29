// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g., 'your_cloud_name'
  api_key: process.env.CLOUDINARY_API_KEY,       // e.g., '123456789012345'
  api_secret: process.env.CLOUDINARY_API_SECRET, // e.g., 'your_api_secret'
});

/**
 * Uploads a buffer to Cloudinary.
 * @param {Buffer} buffer - The image buffer.
 * @param {String} folder - The folder in Cloudinary to upload the image.
 * @returns {Promise<Object>} - The result from Cloudinary.
 */
export const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};