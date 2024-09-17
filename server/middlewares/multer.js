import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Construct __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for handling chat files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, "public", "chat_files");
    fs.mkdirSync(folderPath, { recursive: true }); // Create folder if it doesn't exist
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.originalname}`;
    cb(null, fileName);
  },
});


// Configure multer for handling images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath = "";
    if (req.params.groupId) {
      folderPath = path.join(__dirname, "public", "images", "groups");
    } else {
      folderPath = path.join(__dirname, "public", "images", "users");
    }
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.originalname}`;
    cb(null, fileName);
  },
});

export const fileUpload = multer({
  storage: fileStorage
});


export const imageUpload = multer({
  storage: imageStorage
});
