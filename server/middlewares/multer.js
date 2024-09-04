import multer from "multer";
import fs from "fs"

// Configure multer for handling chat files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = `./public/chat_files`;
    fs.mkdirSync(folderPath, { recursive: true }); // Create folder if it doesn't exist
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.originalname}`;
    cb(null, fileName);
  },
});

// Export the multer middleware for file uploads
export const fileUpload = multer({ storage: fileStorage });

// Configure multer (can be moved to a separate file for better organization)
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.userId || "default";
    const folderPath = `./public/images/users`;
    fs.mkdirSync(folderPath, { recursive: true }); // Create folder if it doesn't exist
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.originalname}`;
    cb(null, fileName);
  },
});

export const imageUpload = multer({ storage: imageStorage });