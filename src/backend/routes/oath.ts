import { Router } from "express";
import { redirectFromGoogle, redirectToGoogle } from "../controllers/oauthGoogleController";

const oauthRouter = Router();

oauthRouter.get("/", redirectToGoogle);
oauthRouter.get("/callback", redirectFromGoogle);

export default oauthRouter;
