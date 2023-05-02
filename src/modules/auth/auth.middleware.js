
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UnAuthorizedError from "../error/error.classes/UnAuthorizedError.js";
import UserService from "../user/user.service.js";
import NotFoundError from "../error/error.classes/NotFoundError.js";

dotenv.config();

const authorize = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // validate auth header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnAuthorizedError("You're Unauthorized to Access This Resource!");
  }

  // extract token
  const token = authHeader.split(" ")[1];

  let authTokenBody;
  // verify token
  try {
    authTokenBody = jwt.verify(token, String(process.env.JWT_SECRET));
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError)
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

const authorizeByRoles = (roles) => {
  return async (req, res, next) => {
    const auth = req.body.auth;
    if (!roles.includes(auth.user.type))
      throw new UnAuthorizedError(
        "You're Unauthorized to Access This Resource!"
      );
    next();
  };
};

export default { authorize, authorizeByRoles };
