import { Request } from "express";

export default (req: Request): string => `${req.protocol}://${req.get("host")}/auth/oauth/google`;
