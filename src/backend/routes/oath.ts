import { Router } from "express";
import { redirectToGoogle } from "../controllers/oauthGoogleController";

const oauthRouter = Router();

oauthRouter.get("/", redirectToGoogle);

export default oauthRouter;
