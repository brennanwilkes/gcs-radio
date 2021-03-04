import { Router } from "express";
import { getUser, login, signUp } from "../controllers/userController";
import { loginValidator, signUpValidator, tokenValidator } from "../validators/userValidator";

const userRouter = Router();

userRouter.post("/", signUpValidator, signUp);
userRouter.post("/login", loginValidator, login);
userRouter.get("/", tokenValidator, getUser);

export default userRouter;
