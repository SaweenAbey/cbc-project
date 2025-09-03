// routes/authRouter.js
import express from "express";
import { googleLogin } from "../controllers/userController.js";

const authRouter = express.Router();

authRouter.post("/google", googleLogin);

export default authRouter;
