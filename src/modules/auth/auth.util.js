import jwt from "jsonwebtoken";
import Joi from "joi";
import BadRequestError from "../error/error.classes/BadRequestError.js";
import bcrypt from "bcryptjs";
import UnAuthorizedError from "../error/error.classes/UnAuthorizedError.js";
import constants from "../../constants.js";

const signToken = (tokenBody) => {
  return jwt.sign(tokenBody, String(process.env.JWT_SECRET), {
    expiresIn: constants.TOKEN_LIFE,
  });
};

const validatePassword = (password) => {
  // define JOI schema
  const passwordSchema = Joi.object({
    password: Joi.string()
      .min(8)
      .required()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/
      )
      .messages({
        "string.base": "Password must be a String!",
        "string.empty": "Password is required!",
        "string.min": "Password must have 8 characters",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!",
      }),
  });

  // validate the password using the schema
  const { error } = passwordSchema.validate({ password });

  if (error) {
    throw new BadRequestError(error.message);
  }
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const verifyPassword = async (password, hash) => {
  // validate password
  const passwordCompare = await bcrypt.compare(password, hash);
  if (!passwordCompare) throw new UnAuthorizedError("Bad Credentials!");
};

const getSessionToken = (authId, userId, userType) => {
  const tokenBody = {
    auth: {
      _id: authId,
    },
    user: {
      _id: userId,
      type: userType,
    },
  };

  // sign token
  const token = signToken(tokenBody);
  return token;
};

export default {
  signToken,
  validatePassword,
  hashPassword,
  verifyPassword,
  getSessionToken,
};
