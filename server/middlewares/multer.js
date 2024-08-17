import multer from "multer";
import fs from "fs"

// Configure multer (can be moved to a separate file for better organization)
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.userId || "default";
    const folderPath = `./public/images/users/${userId}`;
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