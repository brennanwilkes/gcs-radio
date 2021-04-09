import { Request } from "express";

// Utility method to generate the google redirect URI. Maybe should be configurable
export default (req: Request): string => `${req.protocol}://${req.get("host")}/auth/oauth/google`;
