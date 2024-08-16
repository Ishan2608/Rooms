import { Router } from "express";
import { getUserInfo, login, signup, updateProfileInfo } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const routes = Router();
routes.post("/sign-up", signup);
routes.post("/log-in", login);
routes.get("/profile", verifyToken, getUserInfo);
routes.post("/update-profile", verifyToken, updateProfileInfo);

export default routes;
