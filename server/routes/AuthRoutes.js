import { getUserInfo, login, signup, updateProfileInfo } from "../controllers/AuthController";
import { verifyToken } from "../middlewares/AuthMiddleware";

const authRoutes = require("express").Router();
routes.post("/sign-up", signup);
routes.post("/log-in", login);
routes.get("/profile", verifyToken, getUserInfo);
routes.post("/update-profile", verifyToken, updateProfileInfo);

export default authRoutes;
