// Brennan Wilkes

// Imports
import { Router } from "express";
import apiV1Router from "./v1";
import authRouter from "./auth";
import { cookieToHeader } from "../validators/userValidator";

const mainRouter = Router();
mainRouter.use("/api", cookieToHeader, apiV1Router);
mainRouter.use("/api/v1", cookieToHeader, apiV1Router);
mainRouter.use("/auth", cookieToHeader, authRouter);

export default mainRouter;
