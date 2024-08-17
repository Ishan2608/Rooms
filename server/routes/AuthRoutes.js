import { Router } from "express";
import { getUserInfo, login, signup, updateProfileInfo } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { imageUpload } from "../middlewares/multer.js";

const routes = Router();
routes.post("/sign-up", imageUpload.single("image"), signup);
routes.post("/log-in", login);
routes.get("/profile", verifyToken, getUserInfo);
routes.post(
  "/update-profile",
  verifyToken,
  imageUpload.single("image"),
  updateProfileInfo
);

export default routes;
