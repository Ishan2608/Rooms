import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Construct __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for handling chat files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Go up one level to access the 'public' folder
    const folderPath = path.join(__dirname, "../public/chat_files");
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
    let folderPath;
    if (req.params.groupId) {
      // Go up one level to access the 'public' folder for group images
      folderPath = path.join(__dirname, "../public/images/groups");
    } else {
      // Go up one level to access the 'public' folder for user images
      folderPath = path.join(__dirname, "../public/images/users");
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
  storage: fileStorage,
});

// const imageFileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jfif", "image/webp"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed"), false);
//   }
// };

export const imageUpload = multer({
  storage: imageStorage,
  // fileFilter: imageFileFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
});
