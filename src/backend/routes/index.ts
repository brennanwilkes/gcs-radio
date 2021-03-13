// Brennan Wilkes

// Imports
import { Router } from "express";
import apiV1Router from "./v1";
import authRouter from "./auth";
import { cookieToHeader } from "../validators/userValidator";
import apiTracker from "../logging/apiTracker";

const mainRouter = Router();
mainRouter.use("/api", [...cookieToHeader, apiTracker], apiV1Router);
mainRouter.use("/api/v1", [...cookieToHeader, apiTracker], apiV1Router);
mainRouter.use("/auth", cookieToHeader, authRouter);

export default mainRouter;
