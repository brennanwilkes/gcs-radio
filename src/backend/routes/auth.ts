import { Router } from "express";
import { redirectFromGoogle, redirectToGoogle } from "../controllers/oauthGoogleController";
import { redirectToSpotify, redirectFromSpotify, disconnectSpotify } from "../controllers/oauthSpotifyController";
import { getUser, login, signUp, verifyEmail } from "../controllers/userController";
import { existingTokenRedirect, oauthValidator } from "../validators/oauthValidator";
import { loginValidator, signUpValidator, tokenValidator, verifyEmailValidator } from "../validators/userValidator";
import refreshTokenValidator from "../validators/refreshTokenValidator";
import refreshTokenController from "../controllers/refreshTokenController";

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

export default authRouter;
