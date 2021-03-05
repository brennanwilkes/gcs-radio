import { Router } from "express";
import { redirectFromGoogle, redirectToGoogle } from "../controllers/oauthGoogleController";
import { getUser, login, signUp } from "../controllers/userController";
import { loginValidator, signUpValidator, tokenValidator } from "../validators/userValidator";

const authRouter = Router();

authRouter.get("/google", redirectToGoogle);
authRouter.get("/oauth", redirectFromGoogle);

authRouter.post("/", signUpValidator, signUp);
authRouter.post("/login", loginValidator, login);
authRouter.get("/", tokenValidator, getUser);

export default authRouter;
