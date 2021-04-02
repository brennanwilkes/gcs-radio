import { Request } from "express";

export default (req: Request) => `${req.protocol}://${req.get("host")}/auth/oauth/google`;
