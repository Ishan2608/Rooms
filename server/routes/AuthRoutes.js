import { Router } from "express";
import { getUserInfo, login, signup, updateProfileInfo } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
// import { imageUpload } from "../middlewares/multer.js";

import multer from "multer";

const routes = Router();
const upload = multer({dest: "public/images/users"});

routes.post("/sign-up", upload.single("image"), signup);
routes.post("/log-in", login);
routes.get("/profile", verifyToken, getUserInfo);
routes.post(
  "/update-profile",
  verifyToken,
  upload.single("image"),
  updateProfileInfo
);

export default routes;
