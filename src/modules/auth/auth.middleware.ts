import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import UnAuthorizedError from "../error/error.classes/UnAuthorizedError";
import { IAuthSession, IAuthToken } from "./auth.interface";
import UserService from "../user/user.service";

import NotFoundError from "../error/error.classes/NotFoundError";

dotenv.config();

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // validate auth header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnAuthorizedError("You're Unauthorized to Access This Resource!");
  }

  // extract token
  const token = authHeader.split(" ")[1];

  let authTokenBody: IAuthToken;
  // verify token
  try {
    authTokenBody = jwt.verify(
      token,
      String(process.env.JWT_SECRET)
    ) as IAuthToken;
  } catch (error) {
    if (error instanceof TokenExpiredError)
      throw new UnAuthorizedError("Your Session has been Expired!");
    throw new UnAuthorizedError("You're Unauthorized to Access This Resource!");
  }

  // get user
  const dbUser = await UserService.findById(authTokenBody.user._id);
  if (!dbUser) throw new NotFoundError("User Not Found!");

  const authSession = { ...authTokenBody, user: dbUser };
  req.body.auth = authSession;

  next();
};

const authorizeByRoles = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.body.auth as IAuthSession;
    if (!roles.includes(auth.user.type))
      throw new UnAuthorizedError(
        "You're Unauthorized to Access This Resource!"
      );
    next();
  };
};

export default { authorize, authorizeByRoles };
