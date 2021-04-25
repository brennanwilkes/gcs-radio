import { Router } from "express";
import disconnectSpotify from "../controllers/oauth/disconnectSpotify";
import redirectFromGoogle from "../controllers/oauth/redirectFromGoogle";
import redirectFromSpotify from "../controllers/oauth/redirectFromSpotify";
import redirectToGoogle from "../controllers/oauth/redirectToGoogle";
import redirectToSpotify from "../controllers/oauth/redirectToSpotify";
import getMusicKitDeveloperToken from "../controllers/oauth/getMusicKitDeveloperToken";
import getUser from "../controllers/user/getUser";
import login from "../controllers/user/login";
import refreshTokenController from "../controllers/user/refreshTokenController";
import signUp from "../controllers/user/signUp";
import verifyEmail from "../controllers/user/verifyEmail";
import { existingTokenRedirect, oauthValidator } from "../validators/auth/oauthValidator";
import refreshTokenValidator from "../validators/auth/refreshTokenValidator";
import { loginValidator, signUpValidator, tokenValidator, verifyEmailValidator } from "../validators/auth/userValidator";
import connectMusicKitValidator from "../validators/auth/connectMusicKitValidator";
import connectMusicKit from "../controllers/oauth/connectMusicKit";
import disconnectMusicKit from "../controllers/oauth/disconnectMusicKit";

const authRouter = Router();

authRouter.get("/google", existingTokenRedirect, redirectToGoogle);
authRouter.get("/oauth/google", oauthValidator, redirectFromGoogle);

authRouter.post("/spotify", refreshTokenValidator, refreshTokenController);
authRouter.get("/spotify", redirectToSpotify);
authRouter.delete("/spotify", tokenValidator, disconnectSpotify);
authRouter.get("/oauth/spotify", oauthValidator, redirectFromSpotify);

authRouter.post("/", signUpValidator, signUp);
authRouter.post("/login", loginValidator, login);
authRouter.get("/", tokenValidator, getUser);
authRouter.get("/:id", verifyEmailValidator, verifyEmail);

authRouter.post("/musicKit", getMusicKitDeveloperToken);
authRouter.patch("/musicKit", [...tokenValidator, ...connectMusicKitValidator], connectMusicKit);
authRouter.delete("/musicKit", tokenValidator, disconnectMusicKit);

export default authRouter;
