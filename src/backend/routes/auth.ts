import { Router } from "express";
import { redirectFromGoogle, redirectToGoogle } from "../controllers/oauthGoogleController";
import { redirectToSpotify, redirectFromSpotify } from "../controllers/oauthSpotifyController";
import { getUser, login, signUp } from "../controllers/userController";
import { googleValidator, oauthValidator, spotifyValidator } from "../validators/oauthValidator";
import { loginValidator, signUpValidator, tokenValidator } from "../validators/userValidator";

const authRouter = Router();

authRouter.get("/google", googleValidator, redirectToGoogle);
authRouter.get("/oauth/google", oauthValidator, redirectFromGoogle);

authRouter.get("/spotify", spotifyValidator, redirectToSpotify);
authRouter.get("/oauth/spotify", oauthValidator, redirectFromSpotify);

authRouter.post("/", signUpValidator, signUp);
authRouter.post("/login", loginValidator, login);
authRouter.get("/", tokenValidator, getUser);

export default authRouter;
