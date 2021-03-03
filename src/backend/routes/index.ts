// Brennan Wilkes

// Imports
import { Router } from "express";
import apiV1Router from "./v1";
import userRouter from "./user";

const mainRouter = Router();
mainRouter.use("/api", apiV1Router);
mainRouter.use("/api/v1", apiV1Router);

mainRouter.use("/user", userRouter);

export default mainRouter;
