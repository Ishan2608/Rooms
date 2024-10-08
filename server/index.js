import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import chatRoutes from "./routes/ChatRoutes.js";
import {setupSocket} from './socket.js';

// Get the current directory name
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// get values to be used globally
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const dbURL = process.env.MONGODB_CONNECTION_STRING;

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

// // Serve static files for user images
// app.use('/images/users', express.static(path.join(__dirname, 'public', 'images', 'users')));

// // Serve static files for group images
// app.use('/images/groups', express.static(path.join(__dirname, 'public', 'images', 'groups')));

// // Serve static files for chat files
// app.use('/chat_files', express.static(path.join(__dirname, 'public', 'chat_files')));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

// start the server to listen to requests
const server = app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});

setupSocket(server);

mongoose
  .connect(dbURL, {
    serverSelectionTimeoutMS: 6000,
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Error occurred in Mongoose Connection: ");
    console.log(err);
  });
