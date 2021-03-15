import { Router } from "express";
import { redirectFromGoogle, redirectToGoogle } from "../controllers/oauthGoogleController";
import { redirectToSpotify, redirectFromSpotify } from "../controllers/oauthSpotifyController";
import { getUser, login, signUp } from "../controllers/userController";
import { existingTokenRedirect, oauthValidator } from "../validators/oauthValidator";
import { loginValidator, signUpValidator, tokenValidator } from "../validators/userValidator";
import refreshTokenValidator from "../validators/refreshTokenValidator";
import refreshTokenController from "../controllers/refreshTokenController";

const authRouter = Router();

authRouter.get("/google", existingTokenRedirect, redirectToGoogle);
authRouter.get("/oauth/google", oauthValidator, redirectFromGoogle);

authRouter.post("/spotify", refreshTokenValidator, refreshTokenController);
authRouter.get("/spotify", redirectToSpotify);
authRouter.get("/oauth/spotify", oauthValidator, redirectFromSpotify);

authRouter.post("/", signUpValidator, signUp);
authRouter.post("/login", loginValidator, login);
authRouter.get("/", tokenValidator, getUser);

export default authRouter;
