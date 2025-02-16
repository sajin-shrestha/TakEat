import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verifyToken } from "../utils/token";
import { HttpStatusCodes } from "../constants";
import { UserModel } from "../models/userModel";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");
  if (!token)
    return next(createHttpError(HttpStatusCodes.UNAUTHORIZED, "Access denied"));

  try {
    const tokenWithoutBearer = token.replace("Bearer ", "");
    const decoded = verifyToken(tokenWithoutBearer) as { sub: string };

    const user = await UserModel.findById(decoded.sub);

    if (!user)
      return next(createHttpError(HttpStatusCodes.NOT_FOUND, "User Not found"));

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    return next(createHttpError(HttpStatusCodes.UNAUTHORIZED, "Invalid token"));
  }
};

export default authMiddleware;
