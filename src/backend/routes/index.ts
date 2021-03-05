// Brennan Wilkes

// Imports
import { Router } from "express";
import apiV1Router from "./v1";
import authRouter from "./auth";

const mainRouter = Router();
mainRouter.use("/api", apiV1Router);
mainRouter.use("/api/v1", apiV1Router);
mainRouter.use("/auth", authRouter);

export default mainRouter;
