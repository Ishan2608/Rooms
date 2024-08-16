import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import multer from "multer";

// get values to be used globally
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const dbURL = process.env.DATABASE_URL;

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.userId;
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

const imageUpload = multer({ storage: imageStorage });

// global middlewares to use. These apply on the entire app
app.use(
    cors({
        origin: [process.env.ORIGIN],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true, // enable cookies
    })
);
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);

// start the server to listen to requests
const server = app.listen(port, ()=>{
    console.log(`Server running at port: ${port}`);
})


// connect to the database using Mongoose library (an Object Document Mapping tool)
mongoose.connect(dbURL)
    .then(()=>{
        console.log("Connected to Database");
    })
    .catch(err => {
        console.log("Error occurred in Mongoose Connection: ");
        console.log(err);
    })