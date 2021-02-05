// Brennan Wilkes

// Imports
import { Router } from "express";
import apiV1Router from "./v1";

const mainRouter = Router();
mainRouter.use("/api", apiV1Router);
mainRouter.use("/api/v1", apiV1Router);

export default mainRouter;
