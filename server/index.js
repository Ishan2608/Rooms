import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// get values to be used globally
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const dbURL = process.env.DATABASE_URL;

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